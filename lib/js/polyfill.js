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

module.exports = {
  previewImage: previewImage,
  makePhoneCall: makePhoneCall,
  request: request,
  getSystemInfo: getSystemInfo
}