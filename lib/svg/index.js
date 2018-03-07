const svg_to_png = require('svg-to-png')

function svgToPng (files) {
  for (let key in files) {
    svg_to_png.convert(key, files[key])
  }
}


module.exports = svgToPng