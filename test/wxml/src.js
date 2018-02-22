var wxmlToAxml = require('../../lib/wxml/index')
var assert = require('assert')

describe('资源路径替换', function() {
  it('include', () => {
    let code = `<include src="/lizard/system.wxml"/>`
    let result = wxmlToAxml(code)

    assert.equal(result, `<include src="/lizard/system.axml"/>`);
  })

  it('import', () => {
    let code = `<import src="/lizard/all.wxml"/>`
    let result = wxmlToAxml(code)

    assert.equal(result, `<import src="/lizard/all.axml"/>`);
  })
})