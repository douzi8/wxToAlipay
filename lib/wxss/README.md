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