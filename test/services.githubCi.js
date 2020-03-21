const expect = require('chai').expect
const fs = require('fs')

const githubci = require('../services/githubCi')

describe('GithubCI client', () => {
  describe('cloneUrlWithToken', () => {
    it('should attach token to url', function () {
      expect(
        githubci.cloneUrlWithToken('https://myrepo', '123123123')
      ).to.equal('https://x-access-token:123123123@myrepo')
    })
  })

  describe('genTmpFolder', () => {
    it('should create returned folder with suffix', function () {
      const output = githubci.genTmpFolder('randomsuffix')
      expect(fs.existsSync(output)).to.be.true
    })

    it('should create returned folder without suffix', function () {
      const output = githubci.genTmpFolder()
      expect(fs.existsSync(output)).to.be.true
    })
  })
})
