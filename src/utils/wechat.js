const Promise = require('./bluebird')

function login () {
  return new Promise((resolve, reject) => {
    wx.login({ success: resolve, fail: reject })
  })
}

function getUserInfo () {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({success: resolve, fail: reject })
    // wx.getUserInfo({withCredentials:false, success: resolve, fail: reject })
  })
}
//检测登录状态
function checkSession () {
  return new Promise((resolve, reject) => {
    wx.checkSession({success: resolve, fail: reject })
  })
}
//公共弹窗
function showModal(content) {
  wx.showModal({
    title: '提示',
    content: content,
    showCancel:false,
    success: function(res) {
      if (res.confirm) {
        console.log('用户点击确定')
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
}

module.exports = { login, getUserInfo , checkSession , showModal}
