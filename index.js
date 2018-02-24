const wxmlToAxml = require('./lib/wxml/index')
const wxssToAcss = require('./lib/wxss/index')
const jsToAli = require('./lib/js/index')
const appJson = require('./lib/json/app')
const pageJson = require('./lib/json/page')
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

function jsToAliHelp (relative, code) {
  let destPath = path.relative(relative, 'myPolyfill.js').replace('../', '')

  // 追加polyfill
   code = `var _myPolyfill = require('${destPath}')
   ${code}
   `

  code = jsToAli(code)

  return code
}

// 复制polyfill到根目录
function copyPolyFill (dest, callback) {
  console.log('复制polyfill到根目录')

  const babel = require("babel-core")

  fs.copyFileSync('./lib/js/polyfill.js', path.join(dest, 'myPolyfill.js'), {
    process: function(contents) {
      // 第一次批量处理
      contents =  babel.transform(contents, {
        presets: [
          ['es2015',  { modules: false }]
        ],
        comments: false,
      }).code

      if (callback) {
        contents = callback(contents, 'polyfill.js')
      }
  
      return contents;
    }
  });
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

      switch (ext) {
        case 'wxss':
          destFilepath = path.join(dest, relative.replace(/\.wxss$/, '.acss'));
          contents = wxssToAcss(contents)
          break
        case 'js':
          contents = jsToAliHelp(relative, contents)
          break
        case 'wxml':
          destFilepath = path.join(dest, relative.replace(/\.wxml$/, '.axml'));
          try {
            contents = wxmlToAxml(contents)
          } catch (e) {
            throw new Error(`文件${relative}: ${e.message}`)
          }
          
          break
        case 'json':
          if (relative === 'app.json') {
            contents = appJson(contents)
          } else {
            contents = pageJson(contents)
          }
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

  copyPolyFill(dest, callback)
}

module.exports = wxToalipay