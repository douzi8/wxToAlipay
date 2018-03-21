const wxsToJs = require('../../lib/wxs/index')
var assert = require('assert')

describe('wxsToJs', function() {
  it('getRegExp', () => {
    let code = `getRegExp('d{1,4}', 'g')`
    let result = wxsToJs(code)

    assert.equal(result, `new RegExp('d{1,4}', 'g');`);
  })

  it('getDate', () => {
    let code = `getDate('2017-01-01')`
    let result = wxsToJs(code)

    assert.equal(result, `new Date('2017-01-01');`);
  })
})