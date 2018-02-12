const U2 = require("uglify-js")
const babel = require("babel-core")

// 代码转化成es5
function toES5 (code) {
  return babel.transform(code, {
      presets: [
        ['es2015',  { modules: false }]
      ],
      //plugins: ["transform-remove-strict-mode"],
      comments: false,

  }).code
}

function splice_string(str, begin, end, replacement) {
  return str.substr(0, begin) + replacement + str.substr(end);
}

function walker (ast) {
  let nodes = [];

  ast.walk(new U2.TreeWalker(function(node) {
    let exp = node.expression

    // 全局wx替换成my
    if (node instanceof U2.AST_PropAccess && node.expression.name === 'wx') {
      nodes.push({
        type: 1,
        node
      })
    }

    if (node instanceof U2.AST_Call) {
      let callCode = node.expression.print_to_string()

      //getStorageSync, setStorageSync, removeStorageSync
      if ([
          'wx.getStorageSync', 
          'wx.removeStorageSync',
          'wx.setStorageSync'
        ].includes(callCode)) {
        nodes.push({
          type: 2,
          node: node
        })
      }

       // request与httpRequest
      if (callCode === 'wx.request') {
        nodes.push({
          type: 3,
          node: node
        })
      }

      // setNavigationBarTitle
      if ([
          'wx.setNavigationBarTitle',
          'wx.setNavigationBarColor'
        ].includes(callCode)) {
        nodes.push({
          type: 5,
          node: node
        })
      }

      // makePhoneCall参数差异
      if (callCode === 'wx.makePhoneCall') {
        nodes.push({
          type: 6,
          node
        })
      }
    }

    if (node instanceof U2.AST_String && node.value === 'wxMin') {
      nodes.push({
        node,
        type: 4
      })
    }

  }))

  return nodes
}

function jsToAlipay (code) {
  code = toES5(code)

  let nodes = walker(U2.parse(code))

  nodes.reverse().forEach(({
    type,
    node
  }) => {
    var start_pos = node.start.pos;
    var end_pos = node.end.endpos;
    var replacement;

    switch (type) {
      case 1:
      node.expression.name = 'my'
      replacement = node.print_to_string({ beautify: true })
      break
    }


    if (replacement !== undefined) {
      code = splice_string(code, start_pos, end_pos, replacement);
    }
  })

  return code
}


module.exports = jsToAlipay