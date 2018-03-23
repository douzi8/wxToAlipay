const wxmlToAxml = require('./lib/wxml/index')
const wxssToAcss = require('./lib/wxss/index')
const jsToAli = require('./lib/js/index')
const appJson = require('./lib/json/app')
const pageJson = require('./lib/json/page')
const wxsToJs = require('./lib/wxs/index')
const svgToPng = require('./lib/svg/index')
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

function getFilePath (filepath) {
  return path.join(__dirname, filepath)
}

function jsToAliHelp (relative, code) {
  let destPath = path.relative(relative, 'my.shim.js').replace('../', '')

  // 追加polyfill
   code = `var _myShim = require('${destPath}');
   ${code}
   `

  code = jsToAli(code, {
    relative
  })

  return code
}

function printWarn (warn) {
  let msg = '-----打包警告信息:-----\n'

  for (let key in warn) {
    let result = warn[key]

    if (result.length) {
      msg += `文件目录${key}:\n`
      result.forEach((item, index) => {
        msg += `${index + 1}. ${item}\n`
      })
    }
  }

  if (msg.length > 20) {
    msg += `wxml校验文档: https://github.com/douzi8/wxToAlipay/tree/master/lib/wxml`
    console.warn(msg)
  }
}

// 复制polyfill到根目录
function copyPolyFill (shimPath, dest) {
  console.log('复制polyfill到根目录')

  const babel = require("babel-core")

  fs.copyFileSync(shimPath, path.join(dest, 'my.shim.js'), {
    process: function(contents) {
      // 第一次批量处理
      contents =  babel.transform(contents, {
        presets: [
          ['es2015',  { modules: false }]
        ],
        comments: false,
      }).code

      let es = fs.readFileSync(getFilePath('lib/js/es.polyfill.js'), { encoding: 'utf8' })

      return `${es}
${contents.trim()}`;
    }
  });

  // 复制Reflect
  fs.copyFileSync(getFilePath('lib/js/es.reflect.js'), path.join(dest, 'es.reflect.js'))
}

function wxToalipay ({
  src,
  dest,
  filter,
  svgToImage,
  shimPath,
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
    `**/*.{js,wxss,wxml, wxs,json, png, jpg${svgToImage ? '': ',svg'}}`,
    '!project.config.json',
    '!node_modules/**/*',
  ].concat(filter)

  if (shimPath) {
    filter.push(`!${shimPath}`)
  }

  // 删除dest
  if (fs.existsSync(dest)) {
    fs.rmdirSync(dest)
  }

  // 警告信息
  let warn = {}

  fs.copySync(src, dest, { 
    noProcess: '**/*.{jpg, png, svg}',
    filter,
    process (contents, filepath, relative) {
      console.log(`正在打包 ${relative}`)
      let ext = getFileExt(relative)
      let destFilepath

      warn[relative] = []

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
          contents = wxmlToAxml(contents, {
            svgToImage,
            warn: warn[relative]
          })
          break
        case 'json':
          if (relative === 'app.json') {
            contents = appJson(contents)
          } else {
            contents = pageJson(contents)
          }
          break
        case 'wxs':
          destFilepath = path.join(dest, relative.replace(/\.wxs$/, '.wxs.js'))
          contents = wxsToJs(contents)
          break
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


  copyPolyFill(getFilePath('lib/js/shim.js'), dest)

  printWarn(warn)

  if (svgToImage) {
    let svgfiles = {}

    fs.recurseSync(src, ['**/*.svg'], function(filepath, relative, filename) {
      svgfiles[filepath] = path.join(dest, path.dirname(relative), '_svg')
    })

    console.log('***svg打包成png***')
    svgToPng(svgfiles)
  }
}



module.exports = wxToalipay