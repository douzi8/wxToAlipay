const babel = require("babel-core")


function ast ({ types: t }) {
  function getRegExp(path) {
    let [pattern, flag] = path.get('arguments')
    let exp = t.RegExpLiteral(
      pattern.get('value').node,
      flag ? flag.get('value').node : ''
    )
    
    path.replaceWith(exp)
  }

  function require (path) {
    let param = path.get('arguments')[0]

    if (!param) return

    let name = param.get('value').node.trim()
    let reg = /^[\w$]/

     if (reg.test(name)) {
      name = `./${name}`
    }

    param.replaceWith(t.StringLiteral(name))
  }


  function getDate (path) {
    let params = path.get('arguments')

    let exp = t.NewExpression(
      t.Identifier('Date'),
      params.map(item => item.node)
    )
    
    path.replaceWith(exp)
  }

  return {
    name: 'wxs文件转化',
    visitor: {
      CallExpression (path) {
        let caller = path.get('callee')

        if (caller.isIdentifier()) {
          let apiName = caller.get('name').node

          if (apiName === 'getRegExp') {
            getRegExp(path)
          } else if (apiName === 'require') {
            require(path)
          } else if (apiName === 'getDate') {
            getDate(path)
          }
        }
      }
    }
  }
}

function transform(code) {
  // 第一次批量处理
  code =  babel.transform(code, {
    plugins: [
      ast
    ],
    comments: true
  }).code

  return code
}

module.exports = transform