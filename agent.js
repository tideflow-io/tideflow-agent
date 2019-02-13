const pjson = require('./package.json')
const io = require('socket.io-client')
const colors = require('colors')
const pretty = require('./helpers/pretty')
const runner = require('./runner')

/**
 * @param {Object} cli's parameters parsed via commander's npm package
 */
module.exports.exec = (program) => {

  let agent = {}

  // Shows welcome messages
  console.log(pretty.logo())
  console.log(` || Tideflow.io - agent ${pjson.version}`.blue)

  const URL = process.env.TF_AGENT_LOCAL ? 
    'http://localhost:1337' : 
    'https://platform.tideflow.io:1337'

  const socket = io(`${URL}?token=${program.token}`)

  // socket.on('connect', function () {})

  // socket.on('reconnect', function () {})

  // Execute command
  socket.on('tf.command', function (req) {
    if (!agent.authenticated) return
    runner.cmd(socket, 'tf.command', req)
  })

  // Execute code
  socket.on('tf.code', function () {
    if (!agent.token) return
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