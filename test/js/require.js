var jsToAlipay = require('../../lib/js/index')
var assert = require('assert')

describe('require', function() {
  it('纯名字', () => {
    let code = `var dateFormat = require('dateFormat')`
    let result = jsToAlipay(code)

    assert.equal(result, `var dateFormat = require('./dateFormat');`);
  })

  it('带路径', () => {
    let code = `var _babelFn = require('polyfill/index')`
    let result = jsToAlipay(code)

    assert.equal(result, `var _babelFn = require('./polyfill/index');`);
  })
})