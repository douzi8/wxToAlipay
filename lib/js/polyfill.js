function paramsMap (options) {
  let maps = Object.assign({
    success: 'success',
    fail: 'fail',
    complete: 'complete'
  }, options)

  let params = {}

  for (let key in maps) {
    if (maps.hasOwnProperty(key)) {
      params[maps[key]] = maps[key]
    }
  }


  return params
}

// current转为索引
function previewImage (options) {
  let params = paramsMap({
    urls: 'urls',
    current: 'current'
  })
  let current = params.current
  
  if (current) {
    current = options.urls.indexOf(current)
  }

  if (current === -1 || !current) {
    current = 0
  }

  params.current = current

  return params
}


function makePhoneCall (options) {
  return paramsMap({
    phoneNumber: 'number' 
  })
}


function request (options) {
  return paramsMap({
    url: 'url',
    data: 'data',
    header: 'headers',
    method: 'method',
    dataType: 'dataType',
    responseType: 'responseType'
  })
}


// 转为微信参数
// res.system = res.platform + " " + res.system
function getSystemInfo () {
  let params = paramsMap()
  let success = params.success

  if (success) {
    params.success = function (res) {
      res.system = res.platform + " " + res.system
      success(res)
    }
  }
  
  return params
}


module.exports = {
  previewImage,
  makePhoneCall,
  request,
  getSystemInfo
}