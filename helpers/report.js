const colors = require('colors')

/**
 * Given an std output (either stdout or stderr) in either array or string
 * format, conver it to an array and remove empty lines.
 * 
 * For example, if a command outputs the following:
 * 
 * Command in progress...
 * 
 * Please wait a moment.
 * 
 * The filtered result must look like:
 * 
 * ['Command in progress...', 'Please wait a moment.']
 * 
 * @param {Array|string} input std to be converted into a filtered array.
 * @returns {Array} List of strings from the original input.
 */
const parseStd = (input) => {

  // 
  if (!input) return []
  try {
    return (Array.isArray(input) ? input : input.toString().split('\n'))
      .map(l => l.trim())
      .filter(Boolean) || null
  }
  catch (ex) {
    return []
  }
}

module.exports.parseStd = parseStd

/**
 * Reports stds outputed by the in-execution command.
 * 
 * @param {Object} socket Socket's io socket that requested the execution
 * @param {String} topic Original message's topic
 * @param {Object} originalMessage Message that originally requested the execution
 * @param {String} stdout Command's stdout output
 * @param {String} stderr Command's stderr output
 */
const progress = (socket, topic, originalMessage, stdout, stderr) => {
  console.log(' || STDOUT/ERR. Reporting...'.yellow)

  const res = Object.assign(originalMessage, {
    stdout: parseStd(stdout),
    stderr: parseStd(stderr)
  })

  // Make sure the agent doesn't make a report to the server, unless there's
  // an actual std output to be reported.
  if (!res.stdout && !res.stderr) { return }

  socket.emit(`${topic}.progress`, res)
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
const result = (socket, topic, originalMessage, res) => {
  console.log(' || Command executed. Reporting...'.yellow)
  
  const message = Object.assign(originalMessage, {
    stdout: parseStd(res.stdout),
    stderr: parseStd(res.stderr)
  })

  socket.emit(`${topic}.res`, message)
}

module.exports.result = result

/**
 * Reports an exception
 * 
 * @param {Object} socket Socket's io socket that requested the execution
 * @param {Object} originalMessage Message that originally requested the execution
 * @param {Object} executionResult Catched exception
 */
const exception = (socket, topic, originalMessage, ex) => {
  console.log(' || Command returned error'.red)

  socket.emit(`${topic}.exception`, Object.assign(originalMessage, {ex}))
}

module.exports.exception = exception