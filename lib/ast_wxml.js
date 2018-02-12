const U2 = require("uglify-js")

function splice_string(str, begin, end, replacement) {
  return str.substr(0, begin) + replacement + str.substr(end);
}

function removeWxs (code) {
  let ast = U2.parse(code)
  // accumulate `throw "string"` nodes in this array
  let nodes = [];

  ast.walk(new U2.TreeWalker(function(node) {
    if (node instanceof U2.AST_Call) {
      let callCode = node.expression.print_to_string()
      nodes.push({
        type: 1,
        node
      })
    }
  }))

  nodes.reverse().forEach((nodeItem) => {
    var node = nodeItem.node;
    var start_pos = node.start.pos;
    var end_pos = node.end.endpos;

    var replacement;

    if (nodeItem.type === 1 && node.args.length) {

      replacement = node.args[0].print_to_string({
        beautify: true
      })
    }

    if (replacement !== undefined) {
      code = splice_string(code, start_pos, end_pos, replacement);
    }
  })

  return code
}


module.exports = removeWxs