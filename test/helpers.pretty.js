const pretty = require('../helpers/pretty')


describe('pretty', () => {
    describe('logo', () => {
        it('should work as expected', function () {
            pretty.logo({
                version: '123'
            })
        })
    })
})