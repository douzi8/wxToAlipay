var jsToAlipay = require('../../lib/js/index')
var assert = require('assert')

describe('setNavigationBar', function() {
  it('setNavigationBarTitle', () => {
    let code = `wx.setNavigationBarTitle();`
    let result = jsToAlipay(code)

    assert.equal(result, `my.setNavigationBar();`);
  })

  it('setNavigationBarColor', () => {
    let code = `wx.setNavigationBarColor`
    let result = jsToAlipay(code)

    assert.equal(result, `my.setNavigationBar;`);
  })
})