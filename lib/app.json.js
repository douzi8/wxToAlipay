const path = require('path')

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
    windows
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

  if (windows) {
    sandbox.config.window = {
      titleBarColor: windows.navigationBarTextStyle,
      defaultTitle: windows.navigationBarTitleText,
      pullRefresh: windows.enablePullDownRefresh
    }
  }

  return JSON.stringify(sandbox.config,  null, 2)
}

module.exports = appConfig