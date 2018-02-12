## app.json
项目配置

## wxmlToAxml (模板转化规则介绍)
1. ``ul``, ``li``, ``span``, ``a``, ``header``, ``footer``, ``del``标签不能在支付宝小程序里面使用
```
ul       ==> view.alipay_ul    (标签名.类名)
li       ==> view.alipay_li
span     ==> text.alipay_span
header   ==> view.alipay_header
footer   ==> view.alipay_footer
// a, del无法替换，源码不能出现
```

2. 资源.wxml替换成.axml
```
<include src="/lizard/system.wxml" />  ==> <include src="/lizard/system.axml" />
<import src="/lizard/all.wxml" />  ==>  <import src="/lizard/all.axml" />
```

3. 属性替换
```
wx:if          ==> a:if
wx:elif        ==> a:elif
wx:else        ==> a:else
wx:for         ==> a:for
wx:for-index   ==> a:for-index
wx:for-item    ==> a:for-item
wx:key         ==> a:key
bindtap        ==> onTap
catchtap       ==> catchTap
bindinput      ==> onInput
bindchange     ==> onChange
bindfocus      ==> onFocus
```

4. 支付宝``template``的子节点只能是一个而不是多个,并且不能是``block``标签
```html
<template>
 <view wx:for="{{list}}">
 </view>
</template>

<template>
 <view>1</view>
 <view>2</view>
</template>

<template>
  <block>
    <view>1</view>
  </block>
</template>
```

5. ``a:for``和``a:if``不能再支付宝里面同时出现
```html
<view wx:for="{{list}}" wx:if="item.count">
</view>
```
  转为支付宝小程序语法
```html
<block a:for="{{list}}">
  <view a:if="item.count">
  </view>
</block>
```

6. ``image``组件在支付宝小程序不支持``catchtap``
```html
<image catchtap="action" />
```
  转为支付宝小程序语法
```html
<text catchTap="action" class="alipay_catch_img">
  <image />
</text>
```

7. 支付宝小程序不支持``wxs`` (wxs标签全部直接删掉)  
需自行处理JavaScript找出解决方案
```html
<wxs module="m1">
var msg = "hello world";
module.exports.message = msg;
</wxs>

<wxs src="../../widget/filter.wxs" module="filter" />

<view>{{filter.date(time, 'yyyy-mm-dd')}}</view>
```
  转为支付宝小程序语法
```html
<view>{{time}}</view>
```

## wxssToAcss (样式文件转化规则)
1. import路径替换
```css
@import "common.wxss";
```
转为支付宝小程序语法
```css
@import "common.acss";
```

2. 配合wxml, ``ul``, ``li``特殊标签处理
```css
.list li {
  color: red
}
```
  转为支付宝小程序语法
```css
.list .alipay_li {
  color: red
}
```

## Javascript
1. ``wx.``统一转化成``my.``
```JavaScript
wx.api
```
  转为支付宝小程序语法
```JavaScript
my.api
```

2. getStorageSync, setStorageSync, removeStorageSync, getStorageInfoSync
```JavaScript
wx.getStorageSync(key)

wx.setStorageSync(key, result)
```
  转为支付宝小程序语法
```JavaScript
my.getStorageSync({
    key: key
}).data

my.setStorageSync({
  key: key,
  data: result
})
```