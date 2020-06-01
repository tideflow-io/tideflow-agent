#!/usr/bin/env node
'use strict'
const program = require('commander')
const colors = require('colors')
const url = require('url')
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
  .option('-u, --url [url]', 'Tideflow url', (v) => {
    const parse = url.parse(v)
    if (!parse.hostname) { throw new Error(`"${URL}" is not a valid url`) }
    return v
  })
  .option('--noupdate', 'Opt-out of update version check')

// must be before .parse() since
// node's emit() is immediate
 
program.on('--help', function(){
  console.log('')
  console.log('Examples:'.underline)
  console.log('')
  console.log('  $ tideflow-agent -u http://mytideflow.example.com -t agent-auth-token')
  console.log('  $ tideflow-agent -c 16 -t agent-auth-token')
  console.log('  $ tideflow-agent --help')
  console.log('  $ tideflow-agent -h')

  console.log('')
  console.log('Environment variables:'.underline)
  console.log('')
  console.log(' - TF_AGENT_URL'.yellow)
  console.log(`   Current value: ${process.env.TF_AGENT_URL || 'not set'}`.gray)
  console.log('   Specify the URL to connect to the Tideflow\'s platform.')
  console.log('   Optional. Defaults to localhost:3000 if no -u parameter set')
  console.log('   Example: https://subdomain.example.com')
  console.log('')

  console.log(' - TIDEFLOWIO_AGENT_TOKEN'.yellow)
  console.log(`   Current value: ${process.env.TIDEFLOWIO_AGENT_TOKEN || 'not set'}`.gray)
  console.log('   Specify authentication token.')
  console.log('   Optional. Having the authentication token stored as an environment')
  console.log('   variable allows users to run the agent without passing the -t parameter.')
  console.log('   Example: d2a04f78-ff8a-4eb4-a12c-57fb7abf03a7')
  console.log('')
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
