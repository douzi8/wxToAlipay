## wxs处理方法
1. 微信小程序[wxs](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/view/wxs/)
2. 支付宝[wxs](https://docs.alipay.com/mini/framework/sjs)

## wxs文件处理步骤
1. ``{{name}}.wxs``全部变成``{{name}}.sjs``
2. wxs代码处理
```js
<!-- 源码 -->
var tools = require("./tools.wxs");

<!-- 打包 -->
var tools = require("./tools.sjs");
```