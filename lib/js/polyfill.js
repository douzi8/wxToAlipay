function noop () {}

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
  let params = paramsMap(options, {
    header: 'headers',
  })
  let success = params.success || noop

  params.success = function (res) {
    let result = paramsMap(res, {
      headers: 'header',
      status: 'statusCode'
    })

    success(result)
  }

  return params
}

/**
 * wx success里面的system字段为'Android 6.0.1'
 */
function getSystemInfo(options) {
  var params = paramsMap(options)
  var success = params.success || noop

  params.success = function (res) {
    res.system = res.platform + " " + res.system
    success(res)
  }

  return params
}

function getSystemInfoSync (res) {
  res.system = res.platform + " " + res.system

  return res
}

/**
 * wx模态弹窗不同的参数对应到支付宝confirm和alert API
 */
function showModal(options) {
  let params = paramsMap(options)
  let showCancel = params.showCancel

  if (typeof showCancel === 'undefined') {
    showCancel = true
  }

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

/**
 * 参数{icon: 'loading'} 无法成功映射，建议不要使用
 */
function showToast (options) {
  let params = paramsMap(options, {
    title: 'content',
    icon: 'type'
  })

  return params
}

/**
 * sucess回调没有取消操作
 * 点击取消或蒙层时，回调fail, errMsg 为 "showActionSheet:fail cancel"
 */
function showActionSheet (options) {
  let params = paramsMap(options, {
    itemList: 'items'
  })

  let success = params.success || noop
  let fail = params.fail || noop

  params.success = function ({
    index: tapIndex
  }) {
    if (tapIndex === -1) {
      fail({
        errMsg: 'showActionSheet:fail cancel'
      })
    } else {
      success({
        tapIndex
      })
    }
  }

  return params
}

module.exports = {
  previewImage,
  makePhoneCall,
  request,
  getSystemInfo,
  getSystemInfoSync,
  showModal,
  showToast,
  showActionSheet
}