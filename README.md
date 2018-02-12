# wxToAlipay
微信小程序转支付宝小程序

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

4. 支付宝template的子节点只能是一个而不是多个,并且不能是block标签
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

5. a:for和a:if不能再支付宝里面同时出现
```html
<view wx:for="{{list}}" wx:if="item.count">
</view>

==> 替换成

<block a:for="{{list}}">
  <view a:if="item.count">
  </view>
</block>
```

6. image组件在支付宝小程序不支持catchtap
```html
<image catchtap="action" />

==> 替换成

<text catchTap="action" class="alipay_catch_img">
  <image />
</text>
```

7. 支付宝小程序不支持wxs (wxs标签全部直接删掉)
需自行处理JavaScript找出解决方案
```html
<wxs module="m1">
var msg = "hello world";
module.exports.message = msg;
</wxs>

<wxs src="../../widget/filter.wxs" module="filter" />

<view>{{filter.date(time, 'yyyy-mm-dd')}}</view>

===> 替换成

<view>{{time}}</view>
```