var jsToAlipay = require('../../lib/js.ast')
var assert = require('assert')

describe('wx', function() {
  it('属性替换', () => {
    let code = `wx.request`
    let result = jsToAlipay(code)

    assert.equal(result, `my.httpRequest;`);
  })

  it('函数替换', () => {
    let code = `wx.makePhoneCall(options)`
    let result = jsToAlipay(code)

    assert.equal(result, `my.makePhoneCall(options);`);
  })

  it('字符串替换', () => {
    let code = `'alipay' === 'wxMin';`
    let result = jsToAlipay(code)

    assert.equal(result, `'alipay' === 'alipay';`);
  })
})