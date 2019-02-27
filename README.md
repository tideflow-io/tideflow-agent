# Tideflow's agent [![CircleCI](https://circleci.com/gh/tideflow-io/tideflow-agent.svg?style=svg)](https://circleci.com/gh/tideflow-io/tideflow-agent) [![Greenkeeper badge](https://badges.greenkeeper.io/tideflow-io/tideflow-agent.svg)](https://greenkeeper.io/) [![Gitter](https://badges.gitter.im/join_chat.svg)](https://gitter.im/tideflow-io/community)

> Run commands as workflow steps via [tideflow](https://tideflow.io)

## Install

Ensure you have [Node.js](https://nodejs.org) version 8+ installed. Then run the following:

```
$ npm i -g @tideflowio/tideflow-agent
```

## Usage

    $ tideflow-agent --help                                          
    Usage: index [options]

    Options:
      -v, --version                          output the version number
      -c, --concurrency [concurrency]        Max number of jobs the agent should process concurrently
      -t, --token [token]                    Authentication token
      --noupdate                             Opt-out of update version check
      -h, --help                             output usage information

    Examples:
      $ tideflow-agent --help
      $ tideflow-agent -h

You can also run the agent without installing it, via npx.

```bash
npx @tideflowio/tideflow-agent -t [token]
```

## Environment variables

```bash
# Specify the URL to connect to the Tideflow's platform.
# Optional. Defaults to localhost:1337
# Example: http://subdomain.example.com:1337
TF_AGENT_URL
```
