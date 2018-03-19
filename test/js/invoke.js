var jsToAlipay = require('../../lib/js/index')
var assert = require('assert')

describe('invoke', function() {
  it('静态带参数', () => {
    let code = `wx.request(options)`
    let result = jsToAlipay(code)

    assert.equal(result, `_myShim("request", options);`);
  })

  it('静态无参数', () => {
    let code = `wx.request()`
    let result = jsToAlipay(code)

    assert.equal(result, `_myShim("request");`);
  })

  it('动态参数', () => {
    let code = `wx[name](params)`
    let result = jsToAlipay(code)

    assert.equal(result, `_myShim(name, params);`);
  })

  it('动态无参数', () => {
    let code = `wx[name]()`
    let result = jsToAlipay(code)

    assert.equal(result, `_myShim(name);`);
  })

  it('动态字符串', () => {
    let code = `wx['name'](params)`
    let result = jsToAlipay(code)

    assert.equal(result, `_myShim('name', params);`);
  })
})