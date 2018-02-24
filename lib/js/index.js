const babel = require("babel-core")
const alipay = require('./alipay')

module.exports = function (code) {
  // 第一次批量处理
  code =  babel.transform(code, {
    plugins: [
      alipay
    ],
    comments: false
  }).code

  return code.trim()
}