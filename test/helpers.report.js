const expect = require('chai').expect

const report = require('../helpers/report')

describe('report', function () {
  describe('parsing', function () {
    it('should work from string', function () {
      const std = ` Command in progress...

  Please wait a moment.  

  `
      expect(report.parseStd(std)).to.deep.equal(
        ['Command in progress...', 'Please wait a moment.']
      )
    })

    it('should work from array', function () {
      const std = [
        ' Command in progress...  ',
        '',
        '',
        ' ',
        'Please wait a moment.'
      ]

      expect(report.parseStd(std)).to.deep.equal(
        ['Command in progress...', 'Please wait a moment.']
      )
    })
  })
})