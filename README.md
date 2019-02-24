# Tideflow's agent [![CircleCI](https://circleci.com/gh/tideflow-io/tideflow-agent.svg?style=svg)](https://circleci.com/gh/tideflow-io/tideflow-agent) [![Greenkeeper badge](https://badges.greenkeeper.io/tideflow-io/tideflow-agent.svg)](https://greenkeeper.io/)

> Run commands as workflow steps via [tideflow](https://tideflow.io)

## Install

Ensure you have [Node.js](https://nodejs.org) version 8+ installed. Then run
the following:

```
$ npm install --global tideflow-agent
```

## Usage

    $ tideflow-agent --help                                          
    Usage: index [options]

    Options:
      --noupdate           Opt-out of update version check
      -v, --version        output the version number
      -t, --token [token]  Authentication token
      -h, --help           output usage information

    Examples:
      $ tideflow-agent --help
      $ tideflow-agent -h

## Environment variables

```bash
# Specify the URL to connect to the Tideflow's platform.
# Optional. Defaults to localhost:1337
# Example: http://subdomain.example.com:1337
TF_AGENT_URL
```
