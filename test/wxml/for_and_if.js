var wxmlToAxml = require('../../lib/wxml/index')
var assert = require('assert')

describe('资源路径替换', function() {
  it('简单替换', () => {
    let code = `<image class="grid-item" wx:for="{{list}}" wx:if="{{item.src}}"></image>`
    let result = wxmlToAxml(code)

    assert.equal(result, `<block a:for="{{list}}"><image class="grid-item" a:if="{{item.src}}"></image></block>`);
  })

  it('属性保留', () => {
    let code = `<view wx:for="{{list}}" wx:for-index="idx" wx:for-item="itemName" wx:key="title" wx:if="{{itemName.src}}" bindtap="action" data-item="{{itemName}}">1</view>`
    let result = wxmlToAxml(code)

    assert.equal(result, `<block a:for="{{list}}" a:for-index="idx" a:for-item="itemName" a:key="title"><view data-item="{{itemName}}" a:if="{{itemName.src}}" onTap="action">1</view></block>`);
  })
})