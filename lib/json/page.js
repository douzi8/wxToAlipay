let { 
  mapWindows
} = require('../util')

function pageJson (code) {
  var vm = require('vm');
  let sandbox = {
    config: {}
  }
  vm.runInNewContext('var config =' + code, sandbox)

  sandbox.config = mapWindows(sandbox.config)


  return JSON.stringify(sandbox.config,  null, 2)
}


module.exports = pageJson