const babel = require("babel-core")
const alipay =require('./alipay');


// 代码转化成es5
function toES5 (code) {
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


let code = `
let options = {

}
wx.request(options)

wx.request
`



console.log(toES5(code))
