const Promise = require('./bluebird')

/**
 * 抓取远端API
 * @param  {String} path   请求路径
 * @param  {Objece} params 参数
 * @return {Promise}       包含抓取任务的Promise
 */
module.exports = function (api, path, method, params) {
  console.log(wx.getStorageSync('token'))
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${api}/${path}`,
      method:method || 'get',
      data: Object.assign({}, params),
      header: {
        'token':wx.getStorageSync('token'),
        'Content-Type': 'application/json',
        'Accept': 'application/json' 
     },
      // header: { 'Content-Type': 'application/x-www-form-urlencoded'  },
      success: resolve,
      fail: reject
    })
  })
}
