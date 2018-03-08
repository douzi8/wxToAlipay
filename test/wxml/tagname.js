var wxmlToAxml = require('../../lib/wxml/index')
var assert = require('assert')

describe('标签名替换', function() {
  it('ul', () => {
    let code = `<ul class="wrap"></ul>`
    let result = wxmlToAxml(code)

    assert.equal(result, `<view class="wrap alipay_ul"></view>`);
  })

  it('li', () => {
    let code = `<li></li>`
    let result = wxmlToAxml(code)

    assert.equal(result, `<view class="alipay_li"></view>`);
  })

  it('span', () => {
    let code = `<span></span>`
    let result = wxmlToAxml(code)

    assert.equal(result, `<text class="alipay_span"></text>`);
  })

  it('header', () => {
    let code = `<header></header>`
    let result = wxmlToAxml(code)

    assert.equal(result, `<view class="alipay_header"></view>`);
  })

  it('footer', () => {
    let code = `<footer></footer>`
    let result = wxmlToAxml(code)

    assert.equal(result, `<view class="alipay_footer"></view>`);
  })

  it('cover-view', () => {
    let code = `<map><cover-view></cover-view></map><image/>`
    let result = wxmlToAxml(code)

    assert.equal(result, `<map></map><view class="alipay_cover-view"></view><image/>`);
  })
})