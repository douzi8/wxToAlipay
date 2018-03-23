## wxs处理方法
支付宝小程序没有对等的微信小程序[wxs](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/view/wxs/)特性

## wxs文件处理步骤
1. ``{{name}}.wxs``全部变成``{{name}}.wxs.js``
2. getRegExp变成new RegExp
```JavaScript
// 源码
var reg = getRegExp('\d{1,4}', 'g')

// 打包
var reg = /\d{1,4}/g
```
3. getDate变成new Date
```JavaScript
// 源码
var time = getDate('2017-01-01')

// 打包
var time = new Date('2017-01-01')
```
4. wxml解析
没有通用方案，只能自行想办法
```html
<!-- 源码 -->
<view wx:for="{{arr}}" data-item="{{item}}">
  <text>{{filter.priceCent(item.rechargePrice)}} </text>
</view>
<view>{{filter.dateFormat(now, 'yyyy-mm-dd')}}</view>
<wxs src="/widget/filter.wxs" module="filter" />

<!-- 打包 -->
<view wx:for="{{arr}}" data-item="{{item}}">
  <text>{{item.rechargePrice}} </text>
</view>
<view>{{now}}</view>
```

## wxml内嵌wxs
wxs语法暂时无法处理，建议不要内嵌
```html
<!--源码 -->
<wxs module="m1">
var msg = "hello world";

module.exports.message = msg;
</wxs>
<view> {{m1.message}} </view>

<!-- 打包 -->
<view> {{m1.message}} </view>
```