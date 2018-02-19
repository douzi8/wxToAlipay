const WX = 'wx'
const APIMAP = {
  request: 'httpRequest',
  setNavigationBarTitle: 'setNavigationBar',
  setNavigationBarColor: 'setNavigationBar'
}

function findProperty (result, key) {
  return result.find(item => item.get('key.name').node === key)
}

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

  // 词法作用域（lexical scoping）
  function request (path) {
    let params = path.get('arguments')[0]

    if (t.isObjectExpression(params)) {
      params.get('properties').forEach(item => {
        if (item.get('key.name').node === 'header') {
          item.get('key').replaceWith(t.Identifier('headers'))
        }
      })
    } else {
      let name = params.get('name').node

      if (params.scope.hasBinding(name)) {
        let exp = t.AssignmentExpression(
          '=',
          t.MemberExpression(t.Identifier(name), t.Identifier('headers')),
          t.MemberExpression(t.Identifier(name), t.Identifier('header'))
        )

        let deleteKey = t.unaryExpression(
          'delete',
          t.MemberExpression(t.Identifier(name), t.Identifier('header'))
        )

        path.insertBefore(exp)
        path.insertBefore(deleteKey)
      }
    }
  }

  function makePhoneCall (path) {
    let params = path.get('arguments')[0]
    let replacement

    if (!params) {
      throw path.buildCodeFrameError(`wx.makePhoneCall缺少参数`)
    }

    if (t.isObjectExpression(params)) {
      let findNumber = params.get('properties').find(item => item.get('key.name').node === 'phoneNumber')

      if (findNumber) {
        replacement = t.objectExpression([
          t.objectProperty(t.Identifier('number'), findNumber.get('value').node)
        ])
      }
    } else {
      let name = params.get('name').node

      if (params.scope.hasBinding(name)) {
        replacement = t.ObjectExpression([
          t.objectProperty(t.Identifier('number'), t.MemberExpression(t.Identifier(name), t.Identifier('phoneNumber')))
        ])
        
      }
    }

    replacement && params.replaceWith(replacement)
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

  /**
   * 
    wx.getSystemInfo({
      success: function(res) {
        
      }
    })
   */
  function getSystemInfo (path) {
    let params = path.get('arguments')[0]

    if (!params) return

    if (params.isObjectExpression()) {
      let success = findProperty(params.get('properties'), 'success')

      if (success) {
        let callback = success.get('value.params')[0]
        let params = callback.get('name').node

      }
    }
  }


  function moduleExports (path) {
    let exp = t.exportDefaultDeclaration(t.FunctionDeclaration(t.Identifier(''), [], t.BlockStatement([])))

    path.replaceWith(exp)
  }


  return {
    name: '微信Js转支付宝Js',
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
          }

          if (apiName === 'request') {
            request(path)
          }

          if (apiName === 'makePhoneCall') {
            makePhoneCall(path)
          }

          if (apiName === 'getSystemInfo') {
            getSystemInfo(path)
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
      /*AssignmentExpression (path) {
        let left = path.get('left')
        if (  left.isMemberExpression() &&
              left.get('object.name').node === 'module' &&
              left.get('property.name').node === 'exports'
          ) {
          moduleExports(path)
        }
      }*/
    },
    post (state) {
     
    }
  };
  
}