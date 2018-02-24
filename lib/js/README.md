## Javascript
``注意:`` 由于小程序之间的API不是完全对等, 打包会强制在支付宝小程序根目录生成一个[myPolyfill](https://github.com/douzi8/wxToAlipay/blob/master/lib/js/polyfill.js)模块用于处理小程序参数的映射
```JavaScript
module.exports = {
  previewImage,
  makePhoneCall,
  request,
  getSystemInfo,
  getSystemInfoSync,
  showModal,
  showToast,
  showActionSheet
  // ...
}
```

1. 字符串``wxMin``统一替换为``alipay``, 部分不能替换的情况，可以采取在源码这样写代码打标记
```JavaScript
let options = {
  url: 'https://m.lechebang.com/',
}

if ('alipay' === 'wxMin') {
  options.data = JSON.stringify(data)
} else {
  options.data = data
}

wx.request(options)
```
  转为支付宝小程序语法
```JavaScript
if ('alipay' === 'alipay') {
  options.data = JSON.stringify(data)
} else {
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

10. getSystemInfoSync
```JavaScript
var res = wx.getSystemInfoSync()
```
  转为支付宝小程序语法
```JavaScript
var res = _myPolyfill.getSystemInfoSync(my.getSystemInfoSync())
```

11. wx.showModal
```
wx.showModal(options)
```
  转为支付宝小程序语法
```JavaScript
_myPolyfill.showModal(options);
```

12. wx.showToast
```
wx.showToast(options)
```
  转为支付宝小程序语法
```JavaScript
my.showToast(_myPolyfill.showToast(options))
```

13. wx.showActionSheet
```
wx.showActionSheet(options)
```
  转为支付宝小程序语法
```JavaScript
my.showActionSheet(_myPolyfill.showActionSheet(options))
```