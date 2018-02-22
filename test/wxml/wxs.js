var wxmlToAxml = require('../../lib/wxml/index')
var assert = require('assert')

describe('wxs', function() {
  it('include', () => {
    let code = `<wxs module="m1">
var msg = "hello world";
module.exports.message = msg;
</wxs>`
    let result = wxmlToAxml(code)

    assert.equal(result, '');
  })

  it('import', () => {
    let code = `<wxs src="../../widget/filter.wxs" module="filter" /><view>1</view>`
    let result = wxmlToAxml(code)

    assert.equal(result, '<view>1</view>');
  })

  it('wxs函数替换', () => {
    let code = `<view>{{filter.date(time, 'yyyy-dd-mm')}}</view><view>{{filter.date(time2, 'yyyy-dd-mm')}}</view>`
    let result = wxmlToAxml(code)

    assert.equal(result, '<view>{{time}}</view><view>{{time2}}</view>');
  })
})