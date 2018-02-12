const wxmlToAxml = require('./lib/wxml')
const wxssToAcss = require('./lib/wxss')
const jsToAli = require('./lib/js.ast')
const appJson = require('./lib/app.json')
const pageJson = require('./lib/page.json')
const fs = require('file-system')
const path = require('path')


// 获取文件格式
function getFileExt (path) {
  let match = path.match(/\.(\w+)$/)

  return match ? match[1] : '' 
}

function getDest (src) {
  let paths = src.split(path.sep)

  if (!paths[paths.length - 1]) {
    paths.pop()
  }

  paths[paths.length - 1] = paths[paths.length - 1] + '_alipay'
  
  return paths.join(path.sep) 
}


function wxToalipay ({
  src,
  dest,
  filter,
  callback
}) {
  if (!src) {
    throw '必须配置微信小程序源码目录'
  }

  if (!dest) {
    dest = getDest(src)
  }

  if (!Array.isArray(filter)) {
    filter = []
  }

  filter = [
    '**/*.{js,wxss,wxml, wxs,json, svg, png, jpg}',
    '!node_modules/*',
  ].concat(filter)

  // 删除dest
  if (fs.existsSync(dest)) {
    fs.rmdirSync(dest)
  }

  fs.copySync(src, dest, { 
    noProcess: '**/*.{jpg, png, svg}',
    filter,
    process (contents, filepath, relative) {
      console.log(`正在打包 ${relative}`)
      let ext = getFileExt(relative)
      let destFilepath

      if (relative === 'app.json') {
        contents = appJson(contents)
      }


      switch (ext) {
        case 'wxss':
          destFilepath = path.join(dest, relative.replace(/\.wxss$/, '.acss')),
          contents = wxssToAcss(contents)
          break
        case 'js':
          contents = jsToAli(contents)
          break
        case 'wxml':
          destFilepath = path.join(dest, relative.replace(/\.wxml$/, '.axml')),
          contents = wxmlToAxml(contents)
          break
        case 'json':
          contents = pageJson(contents)
      }

      if (callback) {
        contents = callback(contents, relative)
      }


      if (destFilepath) {
        return {
          filepath: destFilepath,
          contents
        }
      }

      return contents
    }
  });
}

module.exports = wxToalipay