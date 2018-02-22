const WX = 'wx'
const APIMAP = {
  request: 'httpRequest',
  setNavigationBarTitle: 'setNavigationBar',
  setNavigationBarColor: 'setNavigationBar'
}
const helpers = require('./helpers')

module.exports =  function ({ types: t }) {

  function storage (path, apiName) {
    let args = path.get('arguments')

    if (!args.length) {
      throw path.buildCodeFrameError(`${name}缺少参数`)
    }

    if (path.parentPath.isMemberExpression()) return

    let result = [
      t.objectProperty(t.Identifier('key'), args[0].node)
    ]

    if (apiName === 'setStorageSync') {
      result.push(t.objectProperty(t.Identifier('data'), args[1].node))
      args[1].remove()
    }

    let properties = t.objectExpression(result)


    args[0].replaceWith(properties)


    if (apiName === 'getStorageSync') {
      let exp = t.MemberExpression(path.node, t.Identifier('data'))

      path.replaceWith(exp)     
    }
  }


  function APIReplace (path) {
    let name = path.get('property.name').node
    let map = APIMAP[name]

    if (map) {
      path.get('property').replaceWith(t.Identifier(map))
    }
  }

  function requirePath (path) {
    let params = path.get('arguments')[0]

    if (!params) {
      throw path.buildCodeFrameError(`require缺少参数`)
    }
    
    let name = params.get('value').node.replace(/\.js$/, '')
    let reg = /^[\w$]/

     if (reg.test(name)) {
      name = `./${name}`
    }

    params.replaceWith(t.StringLiteral(name))
  }


  function makeParams (name, path) {
    let params = path.get('arguments')[0]

    if (!params) {
      throw path.buildCodeFrameError(`${name}缺少参数`)
    }

    params.replaceWith(helpers.makeParams(name, params.node))
  }

  function showModal (path) {
    let params = path.get('arguments')[0]

    path.replaceWith(helpers.showModal(params.node))
  }


  return {
    name: '微信Js转支付宝Js',
    pre () {
      this.cache = new Map();
    },
    visitor: {
      MemberExpression (path) {
        if (path.get('object.name').node === WX) {
          path.get('object').replaceWith(t.Identifier('my'))

          APIReplace(path)
        }
      },
      CallExpression (path) {
        let caller = path.get('callee')

        if (caller.isMemberExpression() && caller.get('object.name').node == 'wx') {
          let apiName = caller.get('property.name').node

          //getStorageSync, setStorageSync, removeStorageSync
          if ([
            'getStorageSync', 
            'removeStorageSync',
            'setStorageSync'
          ].includes(apiName)) {
            storage(path, apiName)
          } else if ([
            'request',
            'makePhoneCall',
            'previewImage',
            'getSystemInfo'
           ].includes(apiName)) {
            makeParams(apiName, path)
          } else if (apiName === 'showModal') {
            showModal(path)
          }
        }

        if (caller.isIdentifier() && caller.get('name').node === 'require') {
          requirePath(path)
        }
      },
      StringLiteral (path) {
        let str = path.get('value').node

        if (str === 'wxMin') {
          path.replaceWith(t.StringLiteral('alipay'))
        }
      }
    },
    post (state) {
      // state.ast.program.body
    }
  };
  
}