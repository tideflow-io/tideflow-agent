const fs = require('fs')
const report = require('../helpers/report')
const os = require('os')
const path = require('path')

const pushRow = (socket, topic, req) => {
  // Report stdout
  report.progress(socket, req, data.toString(), null)
  report.progress(socket, req, null, data.toString())
  
  report.result( socket, req,
    {
      stderr: code ? `EXIT CODE ${code}` : null,
      stdout: code ? null : `EXIT CODE ${code}`
    }
  )
}

module.exports.pushRow = pushRow