const template = require('@babel/template')
const generate = require('@babel/generator').default


const defineHelper = template.program({ placeholderPattern: false });


exports.makeParams = function (name, node) {
  let result = defineHelper(`_myPolyfill.${name}(${generate(node, {}).code})`)()

  return result.body[0]
}


exports.showModal = function (node) {
  let result = defineHelper(`
    _myPolyfill.showModal(${generate(node, {}).code})
  `)()

  return result.body[0]
}

exports.getSystemInfoSync = function (node) {
  let result = defineHelper(`
    _myPolyfill.getSystemInfoSync(${generate(node, {}).code})
  `)()

  return result.body[0]
}


exports.wxs = function () {
  let result = defineHelper(`
    ${generate(node, {}).code}
  `)()

  return result.body[0]
} 