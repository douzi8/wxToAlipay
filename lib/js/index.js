const babel = require("babel-core")
const alipay = require('./alipay')

module.exports = function (code) {
  // 第一次批量处理
  code =  babel.transform(code, {
    plugins: [
      alipay
    ]
  }).code

  return code.trim()
}