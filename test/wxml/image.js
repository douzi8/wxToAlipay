var wxmlToAxml = require('../../lib/wxml/index')
var assert = require('assert')

describe('image组件', function() {
  it('catchtap', () => {
    let code = `<image catchtap="action" src="xx" mode='dd' />`
    let result = wxmlToAxml(code)

    assert.equal(result, `<text class="alipay_catch_img" catchTap="action"><image src="xx" mode="dd"/></text>`);
  })
})