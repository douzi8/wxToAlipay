const babel = require("babel-core")

function ast ({ types: t }) {
  return {
    name: '移除wxs语法',
    visitor: {
      CallExpression (path) {
        let params = path.get('arguments')

        path.replaceWith(params[0])
      }
    }
  }
}

function transform(code) {
  // 第一次批量处理
  code =  babel.transform(code, {
      presets: [
        ['es2015',  { modules: false }]
      ],
      plugins: [
        ast
      ],
      comments: false,

  }).code

  return code.trim().replace(/;$/, '')
}

module.exports = transform