# wxToAlipay
微信小程序转支付宝小程序

## 命令行打包
```
npm install wx-alipay -g

wxToalipay --src={{小程序源码目录}} --dest={{支付宝小程序目录,可缺省}}

// 排除部分资源
wxToalipay --src=/weixin/min --filter="!lizard/package/*,!lizard/Gruntfile.js"

// 定制回调, 在框架处理好后，在对每个文件进行处理
wxToalipay --src=/weixin/min --callback="wxToAlipay.js"
```
wxToAlipay.js定制
```JavaScript
module.exports = function (contents, relative) {
  return contents
}
```


## 模块化打包
```
npm install wx-alipay --save
```
```JavaScript
const wxToalipay = require('wx-alipay')

new wxToalipay({
  src: '/Users/liaowei/Documents/code/weixin/all',
  // 可缺省
  dest: '/Users/liaowei/Documents/code/weixin/all_alipay',
  // 可缺省,数组, 排除资源
  filter: [
    '!lizard/package/*',
  ],
  // 可缺省, 可在框架处理好后，在对每个文件进行处理
  callback (contents, relative) {
    return contents
  }
})
```
[filter](https://github.com/douzi8/file-match)参数详细说明

## 注意事项
1. 微信小程序源码必须能在微信环境运行，转化是基于微信小程序源码
1. 转化现在只测试了``乐车邦微信小程序``, 如有bug，请提issue
1. 部分不能转化的问题，需要源码里面做处理，主要表现在``js``文件
1. 打包之前，会对源码进行代码校验，校验通过才能打包
1. 部分微信小程序特性没法转化, 需自行处理
- [自定义组件](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/custom-component/)
- [web-view](https://mp.weixin.qq.com/debug/wxadoc/dev/component/web-view.html)
- [wxs](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/view/wxs/)

## 语法转化规则
1. [README.md](https://github.com/douzi8/wxToAlipay/blob/master/test/README.md)

## wxml转化注意

## js转化注意
1. wx.request不能完全转化, 建议代码统一封装这个方法
```JavaScript
function request (options) {
  if ('alipay' === 'wxMin') {
    options.data = JSON.stringify(data)
  } else {
    options.data = data
  }

  wx.request(options)
}
```


## 乐车邦微信小程序
![微信小程序](https://raw.githubusercontent.com/douzi8/wxToAlipay/master/demo/lechebang.wx.jpg)


## 乐车邦支付宝小程序
正在开发中...