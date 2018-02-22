var jsToAlipay = require('../../lib/js/index')
var assert = require('assert')

describe('getSystemInfoSync', function() {
  it('纯函数', () => {
    let code = `var res = wx.getSystemInfoSync()`
    let result = jsToAlipay(code)

    assert.equal(result, `var res = _myPolyfill.getSystemInfoSync(my.getSystemInfoSync());`);
  })

  it('函数包裹', () => {
    let code = `var res = fn(wx.getSystemInfoSync())`
    let result = jsToAlipay(code)

    assert.equal(result, `var res = fn(_myPolyfill.getSystemInfoSync(my.getSystemInfoSync()));`);
  })

  it('polyfill函数包裹', () => {
    let code = `var res = _myPolyfill.getSystemInfoSync(wx.getSystemInfoSync())`
    let result = jsToAlipay(code)

    assert.equal(result, `var res = _myPolyfill.getSystemInfoSync(my.getSystemInfoSync());`);
  })
})