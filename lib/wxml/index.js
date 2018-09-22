const HtmlDom = require('htmldom');
const TAGS = [
  {
    src: 'ul',
    dest: 'view'
  },
  {
    src: 'li',
    dest: 'view'
  },
  {
    src: 'span',
    dest: 'text'
  },
  {
    src: 'header',
    dest: 'view'
  },
  {
    src: 'footer',
    dest: 'view'
  },{
    src: 'cover-view',
    dest: 'view'
  }
]

// 属性替换
const ATTRIBUTES = [
  {
    src: 'wx:if',
    dest: 'a:if'
  },
  {
    src: 'wx:elif',
    dest: 'a:elif'
  },
  {
    src: 'wx:else',
    dest: 'a:else'
  },
  {
    src: 'wx:for',
    dest: 'a:for'
  },
  {
    src: 'wx:for-items',
    dest: 'a:for'
  },
  {
    src: 'wx:for-index',
    dest: 'a:for-index'
  },
  {
    src: 'wx:for-item',
    dest: 'a:for-item'
  },
  {
    src: 'wx:key',
    dest: 'a:key'
  },
  {
    src: 'bindtap',
    dest: 'onTap'
  },
  {
    src: 'catchtap',
    dest: 'catchTap'
  },
  {
    src: 'bindinput',
    dest: 'onInput'
  },
  {
    src: 'bindchange',
    dest: 'onChange'
  },
  {
    src: 'bindfocus',
    dest: 'onFocus'
  },
  {
    src: 'bindblur',
    dest: 'onBlur'
  },
  {
    src: 'bindsubmit',
    dest: 'onSubmit'
  }
]

function setAttributes (key, value) {
  value = value.replace(/"/g, '&quot;')

  return `${key}="${value}"`
}


function imageCatch (item, $item) {
  let attrs = ['src', 'mode', 'class']
  let html = []
  let catchtap = $item.attr('catchtap')

  if (catchtap) {
    html.push('<image')

    for (let key in item.attributes) {
      if (attrs.includes(key)) {
        let oldValue = item.attributes[key]

        $item.attr(key, null)
        html.push(' ' + setAttributes(key, oldValue))
      }
    }

    html.push('/>')

    item.name = 'text'
    item.isVoid = false

    $item.html(html.join('')).addClass('alipay_catch_img')
  }
}

function wxForAndwxIf (item, $item) {
  // 这几个属性迁移
  let attrs = ['wx:for', 'wx:for-index', 'wx:for-item', 'wx:key']
  let html = [`<${item.name}`]

  for (let key in item.attributes) {
    if (!attrs.includes(key)) {
      let oldValue = item.attributes[key]
      $item.attr(key, null)
      html.push(' ' + setAttributes(key, oldValue))
    }
  }

  html.push(`>${$item.html()}</${item.name}>`)

  item.name = 'block'
  $item.html(html.join(''))
}

// .wxml替换成.axml
function srcReplace ($item) {
  let oldSrc = $item.attr('src')

  if (oldSrc) {
    $item.attr('src', oldSrc.replace(/\.wxml$/, '.axml'))
  }
}

// 事件替换
function attrsReplace ($item, attrs) {
  ATTRIBUTES.forEach(({
    src,
    dest
  }) => {
    let old = $item.attr(src)

    if (typeof old !== 'undefined') {
      attrs[src] = null
      attrs[dest] = old ? old : ''
    }
  })
}


function validate ($, warn) {
  $('[wx:key]').each((index, item) => {
    let value = $(item).attr('wx:key')

    if (value.includes('.')) {
      warn.push(`wx:key不能嵌套属性, ${value}`)
    } else if (value.includes('{{')) {
      warn.push(`wx:key不能使用花括号, ${value}`)
    }
  })

  if ($('a').length) {
    warn.push(`a标签不支持`)
  }

  if ($('del').length) {
    warn.push('del标签不支持')
  }
}

function dataToLowerCase (attrs) {
  let upReg = /[A-Z]/
  for (let key in attrs) {
    if (key.startsWith('data-')) {
      if (upReg.test(key)) {
        attrs[key.toLowerCase()] = attrs[key]
        delete attrs[key]
      }
    }
  }
}

function moveWxsToTop (parent, wxs) {
  let length = wxs.length

  while (length--) {
    parent.unshift(wxs[length])
  }
}




function wxmlToAxml (code, {
  warn,
  filepath,
  root
}) {
  let html = new HtmlDom(code);
  let $ = html.$;

  if (warn) {
    validate($, warn)
  }

  let wxsCache = []

  // wxs处理
  $('wxs').each((index, item) => {
    item.name = 'import-sjs'

    let $item = $(item)

    $item.attr({
      name: $item.attr('module'),
      module: null
    })

    let src = $item.attr('src')

    if (src) {
      $item.attr({
        src: null,
        from: src.replace(/\.wxs/, '.sjs')
      })
    }

    $(item).remove()
    wxsCache.push(item)
  })


  // image不能使用catchtap
  // image不支持svg文件
  $('image').each((index, item) => {
    let $item = $(item)

    imageCatch(item, $item)
  })

  // button组件处理
  $('button').each((index, item) => {
    let $item = $(item)


    if (!$item.attr('hover-class')) {
      $item.attr('hover-class', 'none')
    }
  })

  // picker-view移除自定义样式
  $('picker-view').each((index, item) => {
    let $item = $(item)

    $item.removeClass().addClass('alipay_picker_view')
    $item.find('picker-view-column > *').removeClass().addClass('alipay_picker_view_item')
  })

  // map子元素迁移
  $('map').each((index, item) => {
    let $item = $(item)
    let child = $item.html().trim()

    child && $item.html('').after(child)
  })

  $('*').each((index, item) => {
    var $item = $(item);

    if ($item.attr('wx:for') && $item.attr('wx:if')) {
      wxForAndwxIf(item, $item)
    }

    // data-xx 属性强制小写
    dataToLowerCase(item.attributes)
  })

  $('*').each((index, item) => {
    var $item = $(item);
    let attrs = {}


    attrsReplace($item, attrs)

    srcReplace($item)

    TAGS.forEach(({
      src,
      dest
    }) => {
      if (item.name === src) {
        item.name = dest
        // 控制标签css
        $item.addClass(`alipay_${src}`)
      }
    })


    $item.attr(attrs)
  })

  

  moveWxsToTop(html.dom.children, wxsCache)


  let result = html.html({
    selfClosed: true
  })


  return result
}


module.exports = wxmlToAxml