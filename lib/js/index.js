const babel = require("babel-core")
const alipay = require('./alipay')

module.exports = function (code) {
  // 第一次批量处理
  code =  babel.transform(code, {
      presets: [
        ['es2015',  { modules: false }]
      ],
      plugins: [
        alipay
      ],
      comments: false,

  }).code

  return code.trim()
}