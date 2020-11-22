const objects = require('./objects')

const keepKeys = ['flow', 'execution', 'log', 'step']

/**
 * Reports stds outputed by the in-execution command.
 * 
 * @param {Object} socket Socket's io socket that requested the execution
 * @param {Object} originalMessage Message that originally requested the execution
 * @param {String} stdout Command's stdout output
 * @param {String} stderr Command's stderr output
 */
const progress = async (socket, originalMessage, stdLines, date) => {
  console.log(` || ${new Date()} ${originalMessage.execution} STDOUT/ERR. Reporting...`)

  const res = Object.assign({}, originalMessage, {
    stdLines: stdLines.map(l => {
      if (!l.d) l.d = new Date()
      return l
    }),
    date: date || null
  })

  // Make sure the agent doesn't make a report to the server, unless there's
  // an actual std output to be reported.
  if (!res.stdLines || !res.stdLines.length) { return }

  await socket.emit('tf.notify.progress', res)
}

module.exports.progress = progress

/**
 * Reports the final result of an execution.
 * 
 * @param {Object} socket Socket's io socket that requested the execution
 * @param {String} topic Original message's topic
 * @param {Object} originalMessage Message that originally requested the execution
 * @param {Object} res Object containing both stds
 */
const result = (socket, originalMessage, result) => {
  console.error(` <= ${new Date()} ${originalMessage.execution} Reporting result`)
  let message = objects.pick(originalMessage, keepKeys)
  socket.emit('tf.notify.result', Object.assign({}, message, {result}))
}

module.exports.result = result

const stdResult = async (socket, originalMessage, result) => {
  console.error(` <= ${new Date()} ${originalMessage.execution} Reporting STD results`)
  let message = objects.pick(originalMessage, keepKeys)
  const res = Object.assign({}, message, {stdLines:result})
  await socket.emit('tf.notify.stdResult', Object.assign({}, res, {error: false}))
}

module.exports.stdResult = stdResult

/**
 * Reports an exception
 * 
 * @param {Object} socket Socket's io socket that requested the execution
 * @param {Object} originalMessage Message that originally requested the execution
 * @param {Object} executionResult Catched exception
 */
const stdException = async (socket, originalMessage, result) => {
  console.error(` <= ${new Date()} ${originalMessage.execution} Reporting STD error`)
  let message = objects.pick(originalMessage, keepKeys)
  const res = Object.assign({}, message, {stdLines:result})
  await socket.emit('tf.notify.stdException', Object.assign({}, res, {error: true}))
}

module.exports.stdException = stdException
