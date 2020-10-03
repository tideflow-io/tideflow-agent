# Tideflow's Self-hosted Runner 

> With Tideflow's Self-hosted Runner, you can run workflow's task in your own server via [TideFlow](https://www.tideflow.io)

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
# Specify authentication token.
# Optional. Having the authentication token stored as an environment
# variable allows users to run the agent without passing the -t parameter.
# Example: d2a04f78-ff8a-4eb4-a12c-57fb7abf03a7
TIDEFLOW_AGENT_TOKEN

# Specify the URL to connect to the Tideflow's platform.
# Optional. Having the URL stored as an environment
# variable allows users to run the agent without passing the -u parameter.
# Example: http://subdomain.example.com:3000
TIDEFLOW_AGENT_URL
```

## How to process data from previous tasks

- **type**: an string that defines the kind of data retuned by the previous
step (object, array, file, etc)
- **data**: an object containing the task's result.

### Command actions

It's possible that the agent will receive preivous tasks results. This is
defined in the workflow's task parameters.

The result from previous tasks are stored in a temporal file. This file's
absolute path is passed as a parameter called "tideflow_previous_file" to the
command to be executed.

For example, if the command to run is `meow`, the agent will execute it as:

`meow --tideflow_previous_file "/tmp/random_file_name"`

The content of such file is a JSON object, with a format similar to:

```json
{
  "execution": {
    "_id": "neL9r33vm38txn9e6"
  },
  "tasks": {
    "the-task-id": {
      "_id": "iesFwrdTtBToRRBzB",
      "stepIndex": 1,
      "type": "file",
      "event": "read-file",
      "createdAt": "2020-10-03T15:55:08.637Z",
      "status": "success",
      "result": {
        "files": [
          {
            "fileName": "my-first-workflow-ifg.json",
            "data": "..."
          }
        ]
      },
      "updatedAt": "2020-10-03T15:55:08.650Z"
    },
    "trigger": {
      "_id": "qJucoXaWaEJqcazoe",
      "stepIndex": "trigger",
      "type": "endpoint",
      "event": "called",
      "createdAt": "2020-10-03T15:55:08.629Z",
      "status": "success",
      "result": {
        "data": {
          "name": "Jose",
          "location": {
            "lat": 42.8867647,
            "lon": -9.2716399
          }
        }
      },
      "updatedAt": "2020-10-03T15:55:08.633Z"
    }
  }
}
```

### NodeJS SFC actions

The result from previous tasks are stored in a file. You can get the absolute
path to this file in a environment variable called `TIDEFLOW_PREVIOUS_FILE`.
This is an example on how you can retrieve the previous actions results:

```javascript
// Include the FileSystem package to read files.
const fs = require('fs')

// Grab the full path of the file that contents previous tasks results
const filePath = process.env.TIDEFLOW_PREVIOUS_FILE

// Read the file contents
const fileContents = fs.readFileSync(filePath, 'utf8')

// Conver the previous tasks results to Javascript object
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
