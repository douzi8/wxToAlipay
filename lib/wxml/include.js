const fs = require('file-system')
const path = require('path')
const HtmlDom = require('htmldom');

function recursionInclude (root, filepath) {
  let code = fs.readFileSync(filepath, { encoding: 'utf8' })
  let html = new HtmlDom(code);
  let $ = html.$;
  let dirpath = path.dirname(filepath)

  $('template').remove()

  $('include').each((index, item) => {
    item = $(item)
    let src = item.attr('src')
    let includeDest = path.join(path.isAbsolute(src) ? root : dirpath, src)

    item.after(recursionInclude(root, includeDest))
    item.remove()
  })


  return html.html({ selfClosed: true })
}


function includeCode (code, root, filepath) {
  let html = new HtmlDom(code);
  let $ = html.$;
  let dirpath = path.dirname(filepath)

  // 需要考虑循环include
  $('include').each((index, item) => {
    item = $(item)
    let src = item.attr('src')
    let includeDest = path.join(path.isAbsolute(src) ? root : dirpath, src)

    item.after(recursionInclude(root, includeDest))
    item.remove()
  })

  // import不循环
  $('import').each((index, item) => {
    let $item = $(item)
    let src = $item.attr('src')
    let includeDest = path.join(path.isAbsolute(src) ? root : dirpath, src)

    try {
      let code = fs.readFileSync(includeDest, { encoding: 'utf8' })
      let html = new HtmlDom(code);
      let $ = html.$;

      let result = []


      $('template').each((index, template) =>{
        result.push(template)
      })

      $item.insertChild(item.parent, item.parent.children.indexOf(item), result)
      
      $item.remove()

    } catch (e) {
      console.log(`模板${filepath}: ${e}`)
    }
  })


  return html.html({
    selfClosed: true
  })
}


module.exports = includeCode