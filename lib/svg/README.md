## svg文件处理 （默认关闭此功能）
转化速度较慢
1. 支付宝小程序不支持svg显示
2. 使用[svg-to-png](https://github.com/filamentgroup/svg-to-png)把svg文件全部自动打包为png
3. wxml资源引用更改
```html
<!-- 源码 -->
<image src="/img/webapp/shop-cart.svg"></image>
<!-- 打包 -->
<image src="/img/webapp/_svg/shop-cart.png"></image>
```