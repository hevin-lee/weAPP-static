// 获取全局应用程序实例对象
// const app = getApp()
const app = getApp();
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    hasMore: true,
    query:{
      category:wx.getStorageSync('cateId'),
      page:1,
      size:10
    },
    movies:[]
  },
 /**
   * 加载更多
   */
  handleLoadMore() {
   
    if (!this.data.hasMore) return

    this.setData({
      subtitle: '加载中...',
      loading: true
    })

    return app.qbaolive.getVideo('/v1/live/audio', 'get', this.data.query)
      .then(d => {

        if (d.data.length) {
          this.setData({
            movies: this.data.movies.concat(d.data),
            hasMore: false,
            loading: false
          })
        } else {
          this.setData({
            hasMore: false,
            loading: false
          })
        }
      })
      .catch(e => {
        this.setData({
          loading: false
        })
        console.error(e)
      })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
     this.setData({
      loading: false
    })
    //加载数据
    this.handleLoadMore()
    // TODO: onLoad
     //分享
    wx.showShareMenu()
    var query = '';
    app.onShareAppMessage('/pages/audio/audio',query)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {
    // TODO: onReady
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {
    // TODO: onShow
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () {
    // TODO: onHide
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload () {
    // TODO: onUnload
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    // TODO: onPullDownRefresh
  },
  /**
   * 图片错误处理
   */
  handleImgError (e) {
    var errorImgIndex= e.target.dataset.errorimg; //获取循环的下标
    var imgObject="movies["+errorImgIndex+"].surfaceImg"; //carlistData为数据源，对象数组
    var errorImg={};
    errorImg[imgObject]="/images/pic_home_morenfengmian@2x.png"; //我们构建一个对象
    this.setData(errorImg) //修改数据源对应的数据
  }
})
