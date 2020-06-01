const pjson = require('./package.json')
const io = require('socket.io-client')
const colors = require('colors')
const url = require('url')
const pretty = require('./helpers/pretty')
const services = require('./services')
const os = require('os')

/**
 * @param {Object} cli's parameters parsed via commander's npm package
 */
module.exports.exec = (program) => {
  
  const cpusCounts = os.cpus().length
  const programConcurrency = program.concurrency || cpusCounts
  let concurrency = programConcurrency >= cpusCounts ? cpusCounts : programConcurrency

  const q = require('queue')({
    concurrency: concurrency
  })

  let agent = {}

  const URL = program.url || process.env.TF_AGENT_URL || 'http://localhost:3000'

  const parse = url.parse(URL)
  if (!parse.hostname) { throw new Error(`"${URL}" is not a valid url`) }

  // Shows welcome messages
  console.log(pretty.logo(pjson))
  console.log(` !! ${new Date()} Tideflow.io - agent ${pjson.version}`.blue)
  console.log(` !! ${new Date()} Using ${concurrency} as concurrency`.yellow)
  console.log(` !! ${new Date()} Target URL ${URL}`.yellow)

  const socket = io(`${URL}?token=${program.token}`)

  socket.on('tf.browser', (req, cb) => {
    if (!agent.authenticated) return cb('not-authorized')
    try {
      const result = services.explorer.browse(socket, 'tf.browser', req)
      cb(result)
    }
    catch (ex) {
      cb(ex)
    }
  })

  socket.on('tf.spreadsheets.pushRow', (req) => {
    if (!agent.authenticated) return
    q.push(services.spreadsheets.pushRow(socket, 'tf.spreadsheets.pushRow', req))
  })

  socket.on('tf.githubCi.pullRequest', (req) => {
    if (!agent.authenticated) return
    q.push(services.githubCi.pullRequest(socket, 'tf.githubCi.pullRequest', req))
  })

  socket.on('tf.githubCi.pullRequest.execution.finished', (req) => {
    if (!agent.authenticated) return
    q.push(services.githubCi.executionFinished(socket, 'tf.githubCi.pullRequest.execution.finished', req))
  })
  
  socket.on('tf.githubCi.push', (req) => {
    if (!agent.authenticated) return
    q.push(services.githubCi.push(socket, 'tf.githubCi.push', req))
  })

  socket.on('tf.githubCi.push.execution.finished', (req) => {
    if (!agent.authenticated) return
    q.push(services.githubCi.executionFinished(socket, 'tf.githubCi.push.execution.finished', req))
  })

  socket.on('tf.githubCi.checksuite', (req) => {
    if (!agent.authenticated) return
    q.push(services.githubCi.checksuite(socket, 'tf.githubCi.checksuite', req))
  })

  socket.on('tf.githubCi.checksuite.execution.finished', (req) => {
    if (!agent.authenticated) return
    q.push(services.githubCi.executionFinished(socket, 'tf.githubCi.checksuite.execution.finished', req))
  })

  socket.on('tf.githubCi.test_cmd', (req) => {
    if (!agent.authenticated) return
    q.push(services.githubCi.test_cmd(socket, 'tf.githubCi.test_cmd', req))
  })

  socket.on('tf.githubCi.run_cmd', (req) => {
    if (!agent.authenticated) return
    q.push(services.githubCi.run_cmd(socket, 'tf.githubCi.run_cmd', req))
  })

  // Execute command
  socket.on('tf.agent.execute', function (req) {
    if (!agent.authenticated) return
    console.log(` => ${new Date()} ${req.execution} Execute`.blue)
    q.push(services.agent.execute(socket, 'tf.agent.execute', req))
  })

  socket.on('tf.agent.code_nodesfc', function(req) {
    if (!agent.authenticated) return
    console.log(` => ${new Date()} ${req.execution} Node SFC`.blue)
    q.push(services.agent.codeNodeSfc(socket, 'tf.agent.code_nodesfc', req))
  })
  
  // Authorize agent
  socket.on('tf.authz', function (auth) {
    agent = Object.assign({authenticated: true}, agent, auth)
    console.log(` !! ${new Date()} Agent ${auth.title} authorized`.green)
  })

  // Show a connection lost message
  socket.on('reconnecting', function () {
    console.error(` !! ${new Date()} Connection lost, reconnecting...`.red)
  })

  // Warm the user in case of error 
  socket.on('error', function (e) {
    console.error(` !! ${new Date()} Error`.red)
    console.error(` !! ${new Date()} ${e}`.red)
  })
}
