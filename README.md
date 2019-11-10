# Tideflow's agent [![CircleCI](https://circleci.com/gh/tideflow-io/tideflow-agent.svg?style=svg)](https://circleci.com/gh/tideflow-io/tideflow-agent) [![Greenkeeper badge](https://badges.greenkeeper.io/tideflow-io/tideflow-agent.svg)](https://greenkeeper.io/)

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
