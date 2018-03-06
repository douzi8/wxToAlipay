const babel = require("babel-core")
const alipay = require('./alipay')

module.exports = function (code, options) {
  options = options || {}

  // 第一次批量处理
  code =  babel.transform(code, {
    plugins: [
      [alipay, options]
    ]
  }).code

  return code.trim()
}