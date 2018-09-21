## wxs处理方法
1. 微信小程序[wxs](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/view/wxs/)
2. 支付宝[wxs](https://docs.alipay.com/mini/framework/sjs)

## wxs文件处理步骤
1. ``{{name}}.wxs``全部变成``{{name}}.sjs``
2. 支付宝不支持module.exports写法
```js
<!-- 微信 -->
module.exports = {
}

<!-- 支付宝 -->
export default {
	
}
```
3. 支付宝不支持require
```js
<!-- 微信 -->
var tools = require("./tools.wxs");

<!-- 支付宝 -->
import tools from './tools.sjs'
```