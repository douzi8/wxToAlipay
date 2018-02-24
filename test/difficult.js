var wxmlToAxml = require('../lib/wxml/index')
var assert = require('assert')
const path = require('path');
const fs = require('file-system')

function readFileSync(filepath) {
  return fs.readFileSync(path.join(__dirname, filepath), { encoding: 'utf8' });
}

function writeFileSync(filepath, content) {
  return fs.writeFileSync(path.join(__dirname, filepath), content, { encoding: 'utf8' });
}

describe('复杂情况', function() {
  it('image', () => {
    let code = `<image class="{{item.pictures.length == 1 ? 'show-one' : 'bg-cut show-img-wrap'}}" data-listindex="{{idx}}" wx:for="{{item.pictures}}" wx:for-item="pic" src="{{pic.thumbnailPath}}" catchtap="zoomAction" data-path="{{pic.thumbnailPath}}"  mode="scaleToFill"></image>`
    let result = wxmlToAxml(code)

    writeFileSync('dest/image.wxml', result)
  })

  it('picker-view', () => {
    let code = readFileSync('wxml/picker-view.wxml')
    let result = wxmlToAxml(code)

    writeFileSync('dest/picker-view.wxml', result)
  })
  
})