# Tideflow's agent 

> With Tideflow's Agent, you can run workflow's task in your own computer via [TideFlow](https://www.tideflow.io)

For more information, visit [TideFlow.io](https://www.tideflow.io)

## Usage

```bash
npx @tideflowio/tideflow-agent -t [token] -u tideflow.example.com
```

    $ tideflow-agent --help
    Usage: index [options]

    Options:
      -v, --version                       output the version number
      -c, --concurrency [concurrency]     Max number of jobs the agent should process concurrently
      -t, --token [token]                 Authentication token
      -u, --url [url]                     Tideflow url
      --noupdate                          Opt-out of update version check
      -h, --help                          output usage information

    Examples:
      $ tideflow-agent --help
      $ tideflow-agent -h

## Environment variables

```bash
# Specify the URL to connect to the Tideflow's platform.
# Optional. Defaults to localhost:1337 if no -u parameter set
# Example: http://subdomain.example.com:1337
TF_AGENT_URL

# Specify authentication token.
# Optional. Having the authentication token stored as an environment
# variable allows users to run the agent without passing the -t parameter.
# Example: d2a04f78-ff8a-4eb4-a12c-57fb7abf03a7
TIDEFLOWIO_AGENT_TOKEN
```

## How to process data from previous tasks

Each of the predecesor tasks results is represented as an array element with
two root properties:

- **type**: an string that defines the kind of data retuned by the previous
step (object, array, file, etc)
- **data**: an object containing the task's result.

### Command actions

The result from previous tasks are sent to the agent commands via the parameter
`--tf_previous`. 

For example, if the command to run is `meow`, the agent will execute it as
`meow --tf_previous <previous-tasks-output>`

The previous task's output is an stringified representation of the following
JSON array:

```json
[ { "type" : "object", "data" : {} } ]
```

### NodeJS SFC actions

The result from previous tasks are stored in a file. You can get the absolute
path to this file in a environment variable called `TF_PREVIOUS_FILE`. This is
an example on how you can retrieve the previous actions results:

```javascript
// Include the FileSystem package to access file system files.
const fs = require('fs')

// Grab the full path of the file that contents previous actions results
const filePath = process.env.TF_PREVIOUS_FILE

// Read the file contents
const fileContents = fs.readFileSync(filePath, 'utf8')

// Conver the previous actions results to Javascript object
const previousResults = JSON.parse(fileContents)
```

---

## Contributing

If you would like to contribute to Tideflow, check out the
[Contributing Guide](https://docs.tideflow.io/docs/contribute).

## License

GNU AFFERO GENERAL PUBLIC LICENSE

## Developer Resources

- Documentation: https://docs.tideflow.io/docs/services-agent
- Contribute: https://docs.tideflow.io/docs/contribute
