#!/usr/bin/env node
'use strict'
const program = require('commander')
const os = require('os')
const pkg = require('./package.json')
  
program
  .version(pkg.version, '-v, --version')
  
  .option('-c, --concurrency [concurrency]', 'Max number of jobs the agent should process concurrently', (v) => {
    const concurrency = parseInt(v)
    if (!concurrency) { throw new Error('Concurrency parameter must be a valid integer') }
    return parseInt(concurrency)
  })
  .option('-t, --token [token]', 'Authentication token', (v) => {
    return v || process.env.TIDEFLOWIO_AGENT_TOKEN
  })
  .option('--noupdate', 'Opt-out of update version check')

// must be before .parse() since
// node's emit() is immediate
 
program.on('--help', function(){
  console.log('')
  console.log('Examples:')
  console.log('  $ tideflow-agent -t agent-auth-token')
  console.log('  $ tideflow-agent -c 16 -t agent-auth-token')
  console.log('  $ tideflow-agent --help')
  console.log('  $ tideflow-agent -h')
})
 
program.parse(process.argv)

if (!program.noupdate) {
  // Checks for available updates
  require('update-notifier')({
    pkg,
    updateCheckInterval: 1000 * 60 * 60 * 24 * 2 // 2 days (actively maintained)
  }).notify({defer: false})
}

if (typeof program.token === 'undefined') {
  console.error('No authentication token provided')
  process.exit(1)
}

require('./agent').exec(program)