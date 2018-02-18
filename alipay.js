const WX = 'wx'

module.exports =  function ({ types: t }) {

  function storage (path) {
    let args = path.get('arguments')

    if (!args.length) {
      throw path.buildCodeFrameError(`${name}缺少参数`)
    }

    let properties = t.objectExpression([
      t.objectProperty(t.Identifier('key'), args[0].node)
    ])


    args[0].replaceWith(properties)
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

    path.get('callee.property').replaceWith(t.Identifier('httpRequest'))
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


  return {
    name: '第一次处理',
    visitor: {
      MemberExpression (path) {
        if (path.get('object.name').node === WX) {
          path.get('object').replaceWith(t.Identifier('my'))
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
            storage(path)
          }

          if (apiName === 'request') {
            request(path)
          }

          if (apiName === 'makePhoneCall') {
            makePhoneCall(path)
          }
        }
      }
    },
  };
  
}