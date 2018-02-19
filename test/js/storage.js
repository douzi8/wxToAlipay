var jsToAlipay = require('../../lib/js.ast')
var assert = require('assert')

describe('storage', function() {
  it('getStorageSync', () => {
    let code = `wx.getStorageSync(key)`
    let result = jsToAlipay(code).replace(/[\n\s]+/g, '')

    assert.equal(result, `my.getStorageSync({key:key}).data;`);
  })

  it('setStorageSync', () => {
    let code = `wx.setStorageSync(key, result)`
    let result = jsToAlipay(code).replace(/[\n\s]+/g, '')

    assert.equal(result, `my.setStorageSync({key:key,data:result});`);
  })

  it('removeStorageSync', () => {
    let code = `wx.removeStorageSync(key)`
    let result = jsToAlipay(code).replace(/[\n\s]+/g, '')

    assert.equal(result, `my.removeStorageSync({key:key});`);
  })
})