const template = require('@babel/template')
const generate = require('@babel/generator').default
const path = require('path')
const defineHelper = template.program({ placeholderPattern: false });
const posix = require('ensure-posix-path')


exports.requireReflect = function (relative) {
  let destPath = `./${posix(path.relative(path.dirname(relative), 'es.reflect'))}`

  let result = defineHelper(`var Reflect = require('${destPath}');`)()

  return result.body[0]
}

exports.invoke = function (name, options) {
  let code = `_myShim(${generate(name, {}).code}`

  if (options && options.length) {
    options.forEach(item => {
      code += `, ${generate(item.node, {}).code}`
    })
  }

  code += ')'

  let result = defineHelper(code)()

  return result.body[0]
} 