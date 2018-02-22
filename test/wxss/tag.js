var wxssToAcss = require('../../lib/wxss/index')
var assert = require('assert')

describe('标签替换', function() {
  it('li', () => {
    let code = `.list li{}`
    let result = wxssToAcss(code)

    assert.equal(result.startsWith('.list .alipay_li'), true);
  })
  
  it('特殊处理', () => {
    let code = `li:nth-child(2n){}`
    let result = wxssToAcss(code)

    assert.equal(result.startsWith('.alipay_li:nth-child(2n)'), true);
  })
})