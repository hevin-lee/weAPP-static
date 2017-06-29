/**
 * API module
 * @type {Object}
 * 用于将微信官方`API`封装为`Promise`方式
 * > 小程序支持以`CommonJS`规范组织代码结构
 */
const wechat = require('./utils/wechat')
const Promise = require('./utils/bluebird')
  /**
   * Q堡直播接口 函数
   * @type {Object}
   */
const qbaolive = require('./utils/qbaolive')

App({
  /**
   * Global shared
   * 可以定义任何成员，用于在整个应用中共享
   */
  data: {
    name: 'Q堡直播',
    version: '1.0.0',
    userInfo: {}
  },

  // 不是只能定义`data`，别的也可以
  title: 'Q堡直播',
  /**
   * 接口
   */
  qbaolive: qbaolive,
  /**
   * 微信公共
   */
  wechat: wechat,
  /**
   * 微信登录login
   * @return {Promise} 包含获取用户信息的`Promise`
   */
  wxlogin() {
    return new Promise((resolve, reject) => {
      // if (this.data.userInfo) return reject(this.data.userInfo)
      wechat.login()
        .then(res => {
          console.log(JSON.stringify(res))

          //获取token
          return qbaolive.getToken('v1/union/login/wxapplet', 'post', {
              code: res.code
            })
            .then(d => {
              // 隐藏loading
              wx.hideLoading()
              if (d.responseCode == 1000) {
                wx.setStorageSync('token', d.data)
                  //获取用户信息
                this.getUserInfo()
              }

            })
            .catch(e => {
              // 隐藏loading
              wx.hideLoading()
              console.error(e)
            })

        })
        .catch(err => {

        })

    })
  },
  /**
   * 获取用户信息
   * @return {Promise} 包含获取用户信息的`Promise`
   */
  getUserInfo() {
    var that = this;
    return new Promise((resolve, reject) => {
      // if (this.data.userInfo) return reject(this.data.userInfo)

      //获取用户信息
      wechat.getUserInfo()
        .then(res => {
          // 请求授权界面
          wx.setStorageSync('userInfo', res.userInfo)

        })
        .then(info => (this.data.userInfo = info))
        .then(info => resolve(info))
        .catch(error => {
          //点击拒绝后
          console.error('获取用户信息失败！  ' + error)
          // wx.showModal({
          //   title: '警告',
          //   content: '若不授权微信登陆，则无法更好的体验Q堡直播；点击授权，则可重新使用进行授权；若点击不授权，后期还使用小程序，需在微信【发现】——【小程序】——删除掉【Q堡直播】，重新搜索授权登录。',
          //   cancelText:'不授权',
          //   confirmText:'授权',
          //   success: function(res) {
          //     if (res.confirm) {
          //       // that.wxlogin()
          //       wx.openSetting({
          //         success: (res) => {
          //             res.authSetting = {
          //               "scope.userInfo": true
          //             }
          //         }
          //       })
          //     } else if (res.cancel) {
          //       console.log('用户点击取消')
          //     }
          //   }
          // })
        })

    })
  },
  /**
   * 获取直播分类
   * @return {Promise} 包含获取用户信息的`Promise`
   */
  getCates() {
    return qbaolive.getApi('v1/live/category', 'get', {})
      .then(d => {
        if (d.data.length) {
          console.log(333)
          for (var i = 0, len = d.data.length; i < len; i++) {
            if (d.data[i].name == '视频') {
              wx.setStorageSync('cateId', d.data[i].id)
            }
          }
        } else {

        }
      })
      .catch(e => {
        console.error(e)
      })
  },
  /**
   * 设置分享
   */
  onShareAppMessage(path,query) {
    return {
      title: '上Q堡直播，让世界看见',
      path: path+query,
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  /**
   * 生命周期函数--监听小程序初始化
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch() {
 
    //全局加载
    // wx.showLoading({
    //     title: '加载中',
    //   })
      //获取视频分类
    this.getCates()
      //获取登录信息
    var userInfo = wx.getStorageSync('userInfo') || {}
    if (userInfo.nickName) {
      this.data.userInfo = userInfo
      console.log('存在')
    } else {
      //执行微信授权
      this.wxlogin()
    }


    // wx.navigateTo({
    //   url: '/pages/login/index'
    // })

  },
  /**
   * 生命周期函数--监听小程序显示
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow() {
    console.log(' ========== Application is showed ========== ')
  },
  /**
   * 生命周期函数--监听小程序隐藏
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide() {
    console.log(' ========== Application is hid ========== ')
  }
})