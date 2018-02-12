function pageJson (code) {
  var vm = require('vm');
  let sandbox = {
    config: {}
  }
  vm.runInNewContext('var config =' + code, sandbox)

  let {
    navigationBarTitleText
  } = sandbox.config

  if (navigationBarTitleText) {
    sandbox.config.defaultTitle = navigationBarTitleText
    delete sandbox.config.navigationBarTitleText
  }


  return JSON.stringify(sandbox.config,  null, 2)
}


module.exports = pageJson