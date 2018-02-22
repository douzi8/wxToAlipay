const path = require('path')
let { 
  mapWindows
} = require('../util')

function appConfig (code) {
  var vm = require('vm');

 let sandbox = {
    config: {}
  };

  vm.runInNewContext('var config =' + code, sandbox)

  let {
    pages,
    subPackages,
    tabBar,
    window: windowConfig
  } = sandbox.config

  if (subPackages) {
    subPackages.forEach(item => {
      item.pages.forEach(child => {
        pages.push(path.join(item.root, child))
      })
    })
    delete sandbox.config.subPackages
  }


  if (tabBar) {
    let items = tabBar.list.map(({
      iconPath: icon,
      selectedIconPath: activeIcon,
      pagePath,
      text: name
    }) => {
      return {
        pagePath,
        icon,
        activeIcon,
        name
      }
    })

    sandbox.config.tabBar = {
      textColor: tabBar.color,
      selectedColor: tabBar.selectedColor,
      backgroundColor: tabBar.backgroundColor,
      items
    }
  }

  if (windowConfig) {
    sandbox.config.window = mapWindows(windowConfig)
  }

  return JSON.stringify(sandbox.config,  null, 2)
}

module.exports = appConfig