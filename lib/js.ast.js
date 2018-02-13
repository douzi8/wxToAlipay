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

      // require
      if (callCode === 'require') {
        nodes.push({
          type: 7,
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


function storage (node) {
  if (!node.args.length) {
    throw new Error(`${node.expression.print_to_string()}缺少参数`)
  }
  
  // 参数替换
  let properties = [
    new U2.AST_ObjectKeyVal({
      key: 'key',
      value: node.args[0]
    })
  ]

  if (node.args.length > 1) {
    properties.push(
      new U2.AST_ObjectKeyVal({
        key: 'data',
        value: node.args[1]
      })
    )
  }

  node.args = [
    new U2.AST_Object({
      properties
    })
  ]

  let result = node.print_to_string({ beautify: true })

  if (node.expression.property === 'getStorageSync') {
    result += '.data'
  }

  return result
}


function request (node) {
  let properties = node.args[0].properties
  
  if (properties) {
    properties.forEach(item => {
      if (item.key === 'header') {
        item.key = 'headers'
      }
    })
  }

  node.expression.property = 'httpRequest'

  return node.print_to_string({ beautify: true })
}


function wxMin (node) {
  return new U2.AST_String({
    value: 'alipay'
  }).print_to_string({
    beautify: true
  })
}

function setNavigationBar (node) {
  node.expression.property = 'setNavigationBar'
  return node.print_to_string({ beautify: true })
}

function makePhoneCall (node) {
  if (!node.args.length) {
    throw new Error(`wx.makePhoneCall缺少参数`)
  }

  let properties = node.args[0].properties
  
  if (properties) {
    properties.forEach(item => {
      if (item.key === 'phoneNumber') {
        item.key = 'number'
      }
    })
  }

  return node.print_to_string({ beautify: true })
}

function requirePath (node) {
  let reg = /^[\w$]/

  if (node.args.length) {
    let name = node.args[0].value.replace(/\.js$/, '')

    if (reg.test(name)) {
      name = `./${name}`
    }

    node.args[0].value = name
  }

  return node.print_to_string({ beautify: true })
}


function moduleExports (code) {
  let ast = U2.parse(code)
  let nodes = []

  ast.walk(new U2.TreeWalker(function(node) {
    let left = node.left

    if (node instanceof U2.AST_Assign 
        && left.property === 'exports'
        && left.expression
        && left.expression.name === 'module'
      ) {
      nodes.push(node)
    }
  }))

  nodes.reverse().forEach(node => {
    var start_pos = node.start.pos;
    var end_pos = node.end.endpos;
    var replacement = 'export default ' + node.right.print_to_string({
      beautify: true
    })

    code = splice_string(code, start_pos, end_pos, replacement);
  })

  return code
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
      case 2:
        replacement = storage(node)
        break
      case 3:
        replacement = request(node)
        break
      case 4:
        replacement = wxMin(node)
        break
      case 5:
        replacement = setNavigationBar(node)
        break
      case 6:
        replacement = makePhoneCall(node)
        break
      case 7:
        replacement = requirePath(node)
        break
    }


    if (replacement !== undefined) {
      code = splice_string(code, start_pos, end_pos, replacement);
    }
  })


  code = moduleExports(code)

  return code
}


module.exports = jsToAlipay