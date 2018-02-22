function paramsMap(options, maps = {}) {
  var params = {}

  for (var key in options) {
    let myKey = maps.hasOwnProperty(key) ? maps[key] : key
    params[myKey] = options[key]
  }

  return params
}

function previewImage(options) {
  var params = paramsMap(options)
  var current = params.current

  if (current) {
    current = options.urls.indexOf(current)
  }

  if (current === -1 || !current) {
    current = 0
  }

  params.current = current

  return params
}

function makePhoneCall(options) {
  return paramsMap(options, {
    phoneNumber: 'number'
  })
}

function request(options) {
  return paramsMap(options, {
    header: 'headers',
  })
}

function getSystemInfo(options) {
  var params = paramsMap(options)
  var success = params.success


  if (success) {
    params.success = function (res) {
      res.system = res.platform + " " + res.system
      success(res)
    }
  }

  return params
}

function getSystemInfoSync (res) {
  res.system = res.platform + " " + res.system

  return res
}

function showModal(options) {
  let params = paramsMap(options)
  let showCancel = params.showCancel

  // 确认框
  if (showCancel) {
    params.confirmButtonText = params.confirmText
    params.cancelButtonText = params.cancelText
  } else {
    // 提醒框
    params.buttonText = params.confirmText
  }

  my[showCancel ? 'confirm' : 'alert'](params)
}

module.exports = {
  previewImage,
  makePhoneCall,
  request,
  getSystemInfo,
  getSystemInfoSync,
  showModal
}