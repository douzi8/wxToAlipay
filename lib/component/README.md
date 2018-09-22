## Component
1. 支付宝只允许在Component入口js里面使用Component变量，在其他Js文件引用会提示``Component is undefined``
可以通过透传自行解决, 比如
```javascript
// 模块入口Js
let call = require('./base')
call(Component)

// base.js
module.exports = function (Component) {
  Component({

  })
}
```

2. 参数差异, 需要在微信源码里面提前自行适配
```javascript
if ('alipay' === 'wxMin') {
  Component({
    // 支付宝组件参数
  })
} else {
  Component({
    // 微信组件参数
  })
}
```