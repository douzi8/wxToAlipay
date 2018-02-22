var wxmlToAxml = require('../../lib/wxml/index')
var assert = require('assert')

describe('template包裹', function() {
  it('wx:for', () => {
    let code = `<template><view wx:for="{{list}}"></view></template>`
    let result = wxmlToAxml(code)

    assert.equal(result, `<template><view class="alipay_template_wrap"><view a:for="{{list}}"></view></view></template>`);
  })

  it('多节点', () => {
    let code = `<template><view>1</view><view>2</view></template>`
    let result = wxmlToAxml(code)

    assert.equal(result, `<template><view class="alipay_template_wrap"><view>1</view><view>2</view></view></template>`);
  })

  it('block', () => {
    let code = `<template><block><view>1</view></block></template>`
    let result = wxmlToAxml(code)

    assert.equal(result, `<template><view><view>1</view></view></template>`);
  })
})