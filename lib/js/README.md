## Javascript
主要使用bable插件完成Js语法替换，参考[babel-types](https://github.com/jamiebuilds/babel-types), [babel-template](https://github.com/babel/babel/tree/master/packages/babel-template), [babel-generator](https://github.com/babel/babel/tree/master/packages/babel-generator), [babel-traverse](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md#babel-traverse)
1. 字符串``wxMin``统一替换为``alipay``, 部分不能替换的情况，可以采取在源码这样写代码打标记
```JavaScript
let options = {
  url: 'https://m.lechebang.com/',
}

if ('alipay' === 'wxMin') {
  options.headers = {
    'content-type': 'application/json'
  }
  options.data = JSON.stringify(data)
} else {
  options.header = {
    'content-type': 'application/json'
  }
  options.data = data
}
wx.request(options)
```
  转为支付宝小程序语法
```JavaScript
if ('alipay' === 'alipay') {
  options.headers = {
    'content-type': 'application/json'
  }
  options.data = JSON.stringify(data)
} else {
  options.header = {
    'content-type': 'application/json'
  }
  options.data = data
}
my.httpRequest(options)
```
2. ``wx.``统一转化成``my.``
```JavaScript
wx.api
```
  转为支付宝小程序语法
```JavaScript
my.api
```

3. getStorageSync, setStorageSync, removeStorageSync, getStorageInfoSync
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

4. wx.request
```JavaScript
wx.request(options)
```
  转为支付宝小程序语法
```JavaScript
my.httpRequest(_myPolyfill.request(options))
```
5. wx.setNavigationBarTitle, wx.setNavigationBarColor  
替换为``my.setNavigationBar``

6. wx.makePhoneCall
```JavaScript
wx.makePhoneCall(options)
```
  转为支付宝小程序语法
```JavaScript
my.makePhoneCall(_myPolyfill.makePhoneCall(options));
```

7. wx.previewImage (参数不一致)
```JavaScript
wx.previewImage(options)
```
  转为支付宝小程序语法
```JavaScript
my.previewImage(_myPolyfill.previewImage(options))
```

8. require
```JavaScript
let local = require('local')
```
  转为支付宝小程序语法
```JavaScript
let local = require('./local')
```

9. wx.getSystemInfo
```JavaScript
wx.getSystemInfo(options)
```
  转为支付宝小程序语法
```JavaScript
my.getSystemInfo(_myPolyfill.getSystemInfo(options));
```