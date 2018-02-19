const babel = require("babel-core")
const alipay = require('./babel')

module.exports = function (code) {
  return babel.transform(code, {
      presets: [
        ['es2015',  { modules: false }]
      ],
      plugins: [
        alipay
      ],
      comments: false,

  }).code
}