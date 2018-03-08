## 校验规则
1. ``wx:key``
参考[微信小程序文档](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/view/wxml/list.html),注意wx:key的值是对应到当前wx:for里面的循环项目的属性或者``*this``
```html
<!-- code对应numberArray某项属性 -->
<view wx:for="{{numberArray}}" wx:key="code">
  <!-- id对应item某项属性 --> 
  <view wx:for="{{item}}" wx:key="id">
  </view>
</view>

<!-- 错误写法 -->
<view wx:for="{{item}}" wx:key="item.id">
</view>
<!-- 错误写法 -->
<view wx:for="{{item}}" wx:key="{{id}}">
</view>
```
2. 不支持``a``, ``del``标签

## wxmlToAxml (模板转化规则介绍)
1. ``ul``, ``li``, ``span``, ``header``, ``footer``标签不能在支付宝小程序里面使用
```
ul       ==> view.alipay_ul    (标签名.类名)
li       ==> view.alipay_li
span     ==> text.alipay_span
header   ==> view.alipay_header
footer   ==> view.alipay_footer
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
wx:for-items   ==> a:for
wx:for-index   ==> a:for-index
wx:for-item    ==> a:for-item
wx:key         ==> a:key
bindtap        ==> onTap
catchtap       ==> catchTap
bindinput      ==> onInput
bindchange     ==> onChange
bindfocus      ==> onFocus
bindsubmit     ==> onSubmit
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
<view data-price="{{price}}">{{filter.priceCent(price, 'yyyy-mm-dd')}}</view>
```
  转为支付宝小程序语法
```html
<view>{{time}}</view>
```

8. placeholder-style

9. picker-view
picker-view组件在支付宝小程序里面有默认样式，如果自己定义了样式，可能会有问题
```html
<picker-view class="ui-scroll-select">
  <picker-view-column wx:for="{{scrollListGroup}}" wx:key="index">
    <view wx:for="{{item}}" wx:for-item="child" class="ui-select-item" wx:key="value">{{child.text}}</view>
  </picker-view-column>
</picker-view>
```
  转为支付宝小程序语法
```html
<picker-view class="alipay_picker_view">
  <picker-view-column wx:for="{{scrollListGroup}}" wx:key="index">
    <view class="alipay_picker_view_item" wx:for="{{item}}" wx:for-item="child" wx:key="value">{{child.text}}</view>
  </picker-view-column>
</picker-view>
```

10. icon组件部分type支付宝不支持，会导致整个页面无法渲染
```
<!-- 源码 -->
<icon type="safe_success" size="45"/>
```
11. data-开头，支付宝不支持大写
```
<!-- 源码 -->
<view data-alpha-beta="1" data-alphaBeta="2">
<!-- 打包 -->
<view data-alpha-beta="1" data-alphabeta="2">
```

12. 支付宝不支持cover-view
```html
<!-- 源码 -->
<map>
  <cover-view>
  </cover-view>
</map>
<!-- 打包 -->
<map></map>
<view></view>
```