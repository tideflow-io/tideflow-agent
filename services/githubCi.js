const git = require('simple-git/promise')
const fs = require('fs-extra')
const os = require('os')
const path = require('path')
const spawn = require('cross-spawn')
const report = require('../helpers/report')

const { createAppAuth } = require('@octokit/auth-app')

/**
 * @param {Object} context Original socket request content with:
 * 
 * {
 *  flow: string,
 *  execution: string,
 *  log: string,
 *  step: string,
 *  triggerService: {
 *    _id: string,
 *    type: string,
 *    title: string,
 *    description: string,
 *    user: string,
 *    config: {},
 *    createdAt: date,
 *    updatedAt: date,
 *    details: {}
 *  },
 *  webhook: {} // Original webhook from Github
 * }
 */
const appAuth = context => {
  const { pem, secret, appId, clientId } = context.triggerService.config
  const { id } = context.webhook.installation

  return createAppAuth({
    id: appId,
    privateKey: pem,
    clientId: clientId,
    clientSecret: secret,
    installationId: id
  })({type: 'installation'})
}

function cloneUrlWithToken(cloneUrl, token) {
  return cloneUrl.replace('https://', `https://x-access-token:${token}@`)
}

module.exports.cloneUrlWithToken = cloneUrlWithToken

const genTmpFolder = subfix => {
  const tmpPath = `${os.tmpdir}${path.sep}${subfix || new Date().getTime()}`
  
  if (fs.existsSync(tmpPath)) {
    return tmpPath
  }
  
  fs.mkdirSync(tmpPath)
  return tmpPath
}

module.exports.genTmpFolder = genTmpFolder

const push = async (socket, topic, req) => {
  const triggerService = req.triggerService
  const webhook = req.webhook
  const repo = webhook.repository.full_name
  const tmpPath = genTmpFolder(req.execution)

  const sha = webhook.head_commit.id

  report.progress(socket, req, [{m: `Clonning ${repo}`}])
  report.progress(socket, req, [{m: `SHA ${sha}`}])
  report.progress(socket, req, [{m: `Temporal path ${tmpPath}`}])

  // Clone repository
  try {
    const auth = await appAuth(req)
    let cloneUrl = cloneUrlWithToken(`https://github.com/${repo}`, auth.token)
    await git().clone(cloneUrl, tmpPath)
    await git(tmpPath).checkout(sha)
    delete req.webhook
    report.stdResult(socket, req, [{ m: 'Clone finished', err: false, d: new Date() }])
  }
  catch (ex) {
    report.stdException(socket, req, [
      { m: ex.toString(), err: true, d: new Date() }
    ])
  }
}

module.exports.push = push

const pullRequest = async (socket, topic, req) => {
  const triggerService = req.triggerService
  const webhook = req.webhook
  const repo = webhook.repository.full_name
  const tmpPath = genTmpFolder(req.execution)

  const sha = webhook.pullRequest.head.sha

  report.progress(socket, req, [{m: `Clonning ${repo}`}])
  report.progress(socket, req, [{m: `SHA ${sha}`}])
  report.progress(socket, req, [{m: `Temporal path ${tmpPath}`}])

  // Clone repository
  try {
    const auth = await appAuth(req)
    let cloneUrl = cloneUrlWithToken(`https://github.com/${repo}`, auth.token)
    await git().clone(cloneUrl, tmpPath)
    await git(tmpPath).checkout(sha)
    delete req.webhook
    report.stdResult(socket, req, [{ m: 'Clone finished', err: false, d: new Date() }])
  }
  catch (ex) {
    report.stdException(socket, req, [
      { m: ex.toString(), err: true, d: new Date() }
    ])
  }
}

module.exports.pullRequest = pullRequest

const checksuite = async (socket, topic, req) => {
  const triggerService = req.triggerService
  const webhook = req.webhook
  const repo = webhook.repository.full_name
  const tmpPath = genTmpFolder(req.execution)

  const sha = webhook.check_suite.head_sha

  report.progress(socket, req, [{m: `Clonning ${repo}`}])
  report.progress(socket, req, [{m: `SHA ${sha}`}])
  report.progress(socket, req, [{m: `Temporal path ${tmpPath}`}])

  // Clone repository
  try {
    const auth = await appAuth(req)
    let cloneUrl = cloneUrlWithToken(`https://github.com/${repo}`, auth.token)
    await git().clone(cloneUrl, tmpPath)
    await git(tmpPath).checkout(sha)
    delete req.webhook
    report.stdResult(socket, req, [{ m: 'Clone finished', err: false, d: new Date() }])
  }
  catch (ex) {
    report.stdException(socket, req, [
      { m: ex.toString(), err: true, d: new Date() }
    ])
  }
}

module.exports.checksuite = checksuite

const executionFinished = async (socket, topic, req) => {
  const tmpPath = genTmpFolder(req.execution)
  fs.removeSync(tmpPath)
}

module.exports.executionFinished = executionFinished

const test_cmd = async (socket, topic, req) => {
  const commands = req.cmd.split('\n')
  const webhook = req.webhook
  const currentStep = req.currentStep
  
  const cwd = genTmpFolder(req.execution)

  let erroed = false
  let error = ''

  const processCommands = commands.map(c => {
    return new Promise((resolve, reject) => {

      let command = c.trim()

      // ignore empty commands
      if (command === '') return resolve()

      if (erroed) return reject()

      report.progress(socket, req, [{m: `$ ${command}`}])

      try {
        let cmdarray = command.split(" ");
        let sp = spawn(cmdarray.shift(), cmdarray, { cwd, stdio: ['inherit', 'pipe', 'pipe'] })

        // Report stdout
        sp.stdout.on('data', data => {
          report.progress(socket, req, [{m:data.toString()}])
        })
        
        // Report stderr
        sp.stderr.on('data', data => {
          report.progress(socket, req, [{m:data.toString(), err: true}])
        })
        
        sp.on('error', error => {
          return reject(error)
        })
        
        // Report Exit code
        sp.on('exit', code => {
          if (code) {
            erroed = true
            error = `EXIT CODE ${code}`
            return reject(error)
          }
          return resolve()
        })
      }
      catch (ex) {
        return reject(ex)
      }
      
    })
  })

  try {
    await Promise.all(processCommands)
    report.stdResult(socket, req, [{ m: 'Execution finished', err: false, d: new Date() }])
  }
  catch (ex) {
    report.stdException(socket, req, [
      { m: ex.toString(), err: true, d: new Date() }
    ])
  }
}

module.exports.test_cmd = test_cmd
module.exports.run_cmd = test_cmd
