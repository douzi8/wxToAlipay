var wxmlToAxml = require('../../lib/wxml/index')
var assert = require('assert')

describe('button', function() {
  it('hover-class存在', () => {
    let code = `<button hover-class="other">default</button>`
    let result = wxmlToAxml(code)

    assert.equal(result, `<button hover-class="other">default</button>`);
  })

  it('hover-class不存在', () => {
    let code = `<button>default</button>`
    let result = wxmlToAxml(code)

    assert.equal(result, `<button hover-class="none">default</button>`);
  })
})