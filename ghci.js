const git = require('simple-git/promise');
const fs = require('fs')
const os = require('os')
const path = require('path')

const genTmpFolder = (subfix) => {
  const tmpPath = `${os.tmpdir}${path.sep}${subfix || new Date().getTime()}`
  fs.mkdirSync(tmpPath)
  return tmpPath
}

const cmd = (socket, topic, req) => {
  const triggerService = req.triggerService
  const webhook = req.webhook
  const repo = webhook.pull_request.head.repo.full_name
  const tmpPath = genTmpFolder(req.executionId)

  console.log({repo, tmpPath})

  // Clone repository
  git()
    .clone(`https://tideflow:${triggerService.config.secret}@github.com/${repo}`, tmpPath)
    .then(result => console.log('finished', result))
    .catch(err => console.error('failed: ', err));
}

module.exports.cmd = cmd