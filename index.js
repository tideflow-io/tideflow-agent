const program = require('commander')

program
  .version(require('./package.json').version, '-v, --version')
  .option('-t, --token [token]', 'Authentication token', (v) => {
    return v || process.env.TIDEFLOWIO_AGENT_TOKEN
  })

// must be before .parse() since
// node's emit() is immediate
 
program.on('--help', function(){
  console.log('')
  console.log('Examples:')
  console.log('  $ tfio-node --help')
  console.log('  $ tfio-node -h')
})
 
program.parse(process.argv)

if (typeof program.token === 'undefined') {
  console.error('No authentication token provided')
  process.exit(1)
}

require('./agent').exec(program)