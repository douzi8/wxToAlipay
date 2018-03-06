var wxmlToAxml = require('../../lib/wxml/index')
var assert = require('assert')

describe('属性替换', function() {
  it('wx:if', () => {
    let code = `<view wx:if="{{condition}}">True</view>`
    let result = wxmlToAxml(code)

    assert.equal(result, `<view a:if="{{condition}}">True</view>`);
  })

  it('wx:elif', () => {
    let code = `<view wx:elif="{{length > 2}}">2</view>`
    let result = wxmlToAxml(code)

    assert.equal(result, `<view a:elif="{{length > 2}}">2</view>`);
  })

  it('wx:else', () => {
    let code = `<view wx:else>3</view>`
    let result = wxmlToAxml(code)

    assert.equal(result, `<view a:else>3</view>`);
  })

  it('wx:for', () => {
    let code = `<view wx:for="{{array}}">{{index}}: wx:for</view>`
    let result = wxmlToAxml(code)

    assert.equal(result, `<view a:for="{{array}}">{{index}}: wx:for</view>`);
  })

  it('wx:for-item, wx:for-index, wx:key', () => {
    let code = `<view wx:for="{{array}}" wx:for-index="idx" wx:for-item="itemName" wx:key="id"></view>`
    let result = wxmlToAxml(code)

    assert.equal(result, `<view a:for="{{array}}" a:for-index="idx" a:for-item="itemName" a:key="id"></view>`);
  })

  it('bindtap', () => {
    let code = `<view id="tapTest" data-hi="WeChat" bindtap="tapName">Click me!</view>`
    let result = wxmlToAxml(code)

    assert.equal(result, `<view id="tapTest" data-hi="WeChat" onTap="tapName">Click me!</view>`);
  })

  it('catchtap, bindinput, bindchange, bindfocus', () => {
    let code = `<view catchtap bindinput bindchange bindfocus>Click me!</view>`
    let result = wxmlToAxml(code)

    assert.equal(result, `<view catchTap onInput onChange onFocus>Click me!</view>`);
  })

  it('data', () => {
    let code = `<view data-alpha-beta="1" data-alphaBeta="2"></view>`
    let result = wxmlToAxml(code)

    assert.equal(result, `<view data-alpha-beta="1" data-alphabeta="2"></view>`);
  })
})