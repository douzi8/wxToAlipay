#!/usr/bin/env node
var path = require('path');
var fs = require('fs');
var argv = process.argv;
const wxToalipay = require('../index')

if (argv.length < 3) {
  throw new Error('缺少毕业参数,如 wxToalipay --src=/weixin/min/')
}

argv.shift()
argv.shift()


let params = {

}

argv.forEach(item => {
  let [key, value] = item.split('=')

  if (value !== undefined) {
    params[key.replace(/^--/, '')] = value
  }
})

if (!params.src) {
  throw new Error('缺少--src参数')
}

if (params.filter) {
  params.filter = params.filter.split(',')
}

if (params.callback) {
  let callbackPath = require(path.join(params.src, params.callback))

  params.callback = callbackPath
}


console.log(`打包参数`)
console.log(params)

wxToalipay(params)


