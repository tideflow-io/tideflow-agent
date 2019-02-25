const pjson = require('./package.json')
const io = require('socket.io-client')
const colors = require('colors')
const pretty = require('./helpers/pretty')
const runner = require('./runner')
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

  // Shows welcome messages
  console.log(pretty.logo())
  console.log(` || Tideflow.io - agent ${pjson.version}`.blue)
  console.log(` || Using ${concurrency} as concurrency`.yellow)

  const URL = process.env.TF_AGENT_URL || 'http://localhost:1337'

  const socket = io(`${URL}?token=${program.token}`)

  // Execute command
  socket.on('tf.command', function (req) {
    if (!agent.authenticated) return
    q.push(runner.cmd(socket, 'tf.command', req))
  })

  // Execute code
  socket.on('tf.code', function () {
    if (!agent.authenticated) return
    q.push(runner.code(socket, 'tf.code', req))
  })

  // Authorize agent
  socket.on('tf.authz', function (auth) {
    agent = Object.assign({authenticated: true}, agent, auth)
    console.log(` || Agent ${auth.title} authorized`.green)
  })

  // Show a connection lost message
  socket.on('reconnecting', function () {
    console.error(` || Connection lost, reconnecting...`.red)
  })

  // Warm the user in case of error 
  socket.on('error', function (e) {
    console.error(` || Error`.red)
    console.error(` || ${e}`.red)
  })
}