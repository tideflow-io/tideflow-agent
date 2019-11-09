const spawn = require('cross-spawn')
const tmp = require('tmp')
const fs = require('fs')
const report = require('../helpers/report')
const os = require('os')
const path = require('path')
const nodesfc = require('nodesfc')

/**
 * Handles the execution of commands sent from the platform
 * 
 * @param {Object} socket Socket's io socket that requested the execution
 * @param {String} topic Original message's topic
 * @param {Object} req Original request that came fromthe platform
 */
const execute = (socket, topic, req) => {
  return new Promise((resolve, reject) => {
    
    // Store code in tmp file
    const previousfile = tmp.tmpNameSync()
    const commandFile = tmp.tmpNameSync()
    fs.writeFileSync(commandFile, req.command)

    // Given the command to execute, get the program's name and its parameters
    // in order to pass them to child_process.spawn
    const command = process.platform === 'win32' ? 'sh' : 'bash'
    let parameters = [commandFile]

    // Check if the command is attaching the output from the previous flow's step
    if (req.previous) {
      fs.writeFileSync(previousfile, req.previous)
      parameters.push('--tf_previous_file')
      parameters.push(previousfile)
    }

    // Execute the command in a child process so that stds can be monitored
    let sp = spawn(command, parameters)

    // Report stdout
    sp.stdout.on('data', data =>
      report.progress(socket, req, data.toString(), null)
    )
    
    // Report stderr
    sp.stderr.on('data', data =>
      report.progress(socket, req, null, data.toString())
    )
    
    // Report Exit code
    sp.on('exit', code => {
      fs.unlinkSync(previousfile)
      fs.unlinkSync(commandFile)
      report.result( socket, req,
        {
          stderr: code ? `EXIT CODE ${code}` : null,
          stdout: code ? null : `EXIT CODE ${code}`
        }
      )

      return code ? reject(code) : resolve()
    })
    
    // Report an exception
    sp.on('error', (error) => {
      fs.unlinkSync(previousfile)
      fs.unlinkSync(commandFile)
      report.exception( socket, req, error.toString() )
      return reject(error)
    })
  })
}

module.exports.execute = execute



/**
 * Handles the execution of nodejs code sent from the platform
 * 
 * @param {Object} socket Socket's io socket that requested the execution
 * @param {String} topic Original message's topic
 * @param {Object} req Original request that came fromthe platform
 */
const codeNodeSfc = async (socket, topic, req) => {
  const file = tmp.tmpNameSync()
  fs.writeFileSync(file, req.code)

  try {
    let result = await nodesfc.init({file})
    report.bulkResult(socket, req, result)
  }
  catch (ex) {
    console.error({ex})
    report.exception( socket, req, ex.toString() )
  }
  finally {
    fs.unlinkSync(file)
  }
}

module.exports.codeNodeSfc = codeNodeSfc