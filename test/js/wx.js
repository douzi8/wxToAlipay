var jsToAlipay = require('../../lib/js/index')
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

    assert.equal(result, `_myShim("makePhoneCall", options);`);
  })

  it('字符串替换', () => {
    let code = `'alipay' === 'wxMin';`
    let result = jsToAlipay(code)

    assert.equal(result, `'alipay' === 'alipay';`);
  })


  it('全局替换', () => {
    let code = `Object.keys(wx)`
    let result = jsToAlipay(code)
    

    assert.equal(result, `Object.keys(my);`);

    let code2 = `var wx ={};Object.keys(wx)`
    let result2 = jsToAlipay(code2)

    assert.equal(result2, `var wx = {};Object.keys(wx);`);

    let code3 = `a.wx;`
    let result3 = jsToAlipay(code3)

    assert.equal(result3, `a.wx;`);

    let code4 = `{wx:'key'}`
    let result4 = jsToAlipay(code4)

    assert(result4.includes('wx'))
  })
})