const babel = require("babel-core")

const template = require('@babel/template')
const generate = require('@babel/generator').default
const defineHelper = template.program({ placeholderPattern: false });



function importAst (key, path) {
  let result = defineHelper(`import ${key} from '${path}'`)()

  return result.body[0]
}




function ast ({ types: t }) {

  function changeRequire (path, caller) {
    let param = caller.get('arguments')[0]

    if (!param) return

    let name = param.get('value').node.trim().replace(/\.wxs$/, '.sjs')
    let key = path.get('id').node.name



    path.parentPath.replaceWith(importAst(key, name))
  }


  function changeExports (path) {
    let right = path.get('right')
    let result = defineHelper(`export default ${generate(right.node, {}).code}`)()


    path.replaceWith(result.body[0])
  }

  return {
    name: 'wxs文件转化',
    visitor: {
      VariableDeclarator (path) {
        let value = path.get('init')

        if (value.isCallExpression()) {
          let caller = value.get('callee')

          if (caller.isIdentifier()) {
            let apiName = caller.get('name').node

            if (apiName === 'require') {
              changeRequire(path, value)
            }
          }
        }
      },
      AssignmentExpression (path) {
        let left = path.get('left')
        let leftObject = left.get('object')
        let leftPro = left.get('property')

        if (
            leftObject.isIdentifier() &&
            leftPro.isIdentifier()
          ) {
          if (
              leftObject.node.name === 'module' &&
              leftPro.node.name === 'exports'
            ) {
            changeExports(path)
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
    auxiliaryCommentBefore: '',
    comments: true
  }).code


  // 结尾的立即执行函数，暂时不知道怎么处理比较好
  code = code.replace(/\(function\s*\(\)\s*\{([\s\S]+)\}\)\(\);\s*$/, '$1').trim()

  return code
}

module.exports = transform