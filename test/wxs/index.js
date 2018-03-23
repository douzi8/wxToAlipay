const wxsToJs = require('../../lib/wxs/index')
var assert = require('assert')

describe('wxsToJs', function() {
  it('getRegExp', () => {
    let code = `getRegExp("\d{16}", "g")`
    let result = wxsToJs(code)

    assert.equal(result, `/\d{16}/g;`);
  })

  it('getRegExp没有参数', () => {
    let code = `getRegExp("\d{16}")`
    let result = wxsToJs(code)

    assert.equal(result, `/\d{16}/;`);
  })

  it('getDate', () => {
    let code = `getDate('2017-01-01')`
    let result = wxsToJs(code)

    assert.equal(result, `new Date('2017-01-01');`);
  })
})