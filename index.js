const program = require('commander')
const pkg = require('./package.json')
  
program
  .version(pkg.version, '-v, --version')
  .option('-t, --token [token]', 'Authentication token', (v) => {
    return v || process.env.TIDEFLOWIO_AGENT_TOKEN
  })
  .option('--noupdate', 'Opt-out of update version check')

// must be before .parse() since
// node's emit() is immediate
 
program.on('--help', function(){
  console.log('')
  console.log('Examples:')
  console.log('  $ tfio-node --help')
  console.log('  $ tfio-node -h')
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