var wxssToAcss = require('../../lib/wxss/index')
var assert = require('assert')

describe('import', function() {
  it('路径替换', () => {
    let code = `@import "/style/common.wxss";`
    let result = wxssToAcss(code)

    assert.equal(result, `@import "/style/common.acss";`);
  })

  
})