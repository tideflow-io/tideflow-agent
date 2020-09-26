const colors = require('colors')

/**
 * Given an std output (either stdout or stderr) in either array or string
 * format, convert it to an array and remove empty lines.
 * 
 * For example, if a command outputs the following:
 * 
 * - Command in progress...
 * - 
 * - Please wait a moment.
 * - 
 * 
 * The result must look like:
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
    console.error(ex)
    return []
  }
}

module.exports.parseStd = parseStd

/**
 * Reports stds outputed by the in-execution command.
 * 
 * @param {Object} socket Socket's io socket that requested the execution
 * @param {Object} originalMessage Message that originally requested the execution
 * @param {String} stdout Command's stdout output
 * @param {String} stderr Command's stderr output
 */
const progress = async (socket, originalMessage, stdLines, date) => {
  console.log(` || ${new Date()} STDOUT/ERR. Reporting...`)

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
 * Reports the final result of an execution, with all stds as an array
 * 
 * @param {Object} socket Socket's io socket that requested the execution
 * @param {Object} originalMessage Message that originally requested the execution
 * @param {object} result Command's stds and exit code output:
 * 
 *  {
 *    stdLines: [{
 *      output: string,
 *      err: boolean,
 *      date: date
 *    }],
 *    code: number
 *  }
 */
const bulkResult = async (socket, originalMessage, result) => {
  console.error(` <= ${new Date()} ${originalMessage.execution} Reporting`)
  const res = Object.assign(originalMessage, result)
  await socket.emit('tf.notify.finishBulk', Object.assign({}, res, {error: false}))
}

module.exports.bulkResult = bulkResult

/**
 * Reports the final result of an execution.
 * 
 * @param {Object} socket Socket's io socket that requested the execution
 * @param {String} topic Original message's topic
 * @param {Object} originalMessage Message that originally requested the execution
 * @param {Object} res Object containing both stds
 */
const result = (socket, originalMessage, res) => {
  console.error(` <= ${new Date()} ${originalMessage.execution} Reporting`)
  socket.emit('tf.notify.finish', Object.assign({}, originalMessage, res))
}

module.exports.result = result

/**
 * Reports an exception
 * 
 * @param {Object} socket Socket's io socket that requested the execution
 * @param {Object} originalMessage Message that originally requested the execution
 * @param {Object} executionResult Catched exception
 */
const exception = async (socket, originalMessage, ex) => {
  console.error(` <= ${new Date()} ${originalMessage.execution} Error`)
  const res = Object.assign(originalMessage, ex)
  await socket.emit('tf.notify.finishBulk', Object.assign({}, res, {error: true}))
}

module.exports.exception = exception
