const template = require('@babel/template')
const generate = require('@babel/generator').default


const defineHelper = template.program({ placeholderPattern: false });


exports.makeParams = function (name, node) {
  let result = defineHelper(`_myPolyfill.${name}(${generate(node, {}).code})`)()

  return result.body[0]
}