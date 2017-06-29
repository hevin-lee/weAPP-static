// 获取全局应用程序实例对象
const app = getApp()
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    videoUrl:'',
    goldNum:"",
    onlineNum:"",
    currentTime:'00:00',
    user:{
      total:0,
      avatar: "",
      nickName: "",
      goldNum: 0,
      anchorId: '',
      viewers: [],
      otherNum:0
    },
    video:{
      isLive:true,
      url:'',
      sourceWay:1 //手机来源
    },
    page:1,
    userList:[]
  },
  /**
   * 获取金币
   */
    getGold(options) {
        app.qbaolive.getApi('v1/gold/account/info/' + options.userId, 'get', {})
        .then(d => {
          if (d.responseCode == 1000) {
            this.setData({
              goldNum:d.data.goldNum
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
   * 获取主播信息
   */
  getUserInfo(options) {
    var self = this;
    // app.qbaolive.getApi('v1/live/anchorinfoviewers/'+options.userId, 'get', {})
    app.qbaolive.getApi('v1/live/anchorinfoviewers/'+options.vodId, 'get', {})
    .then(d => {
      if(d.responseCode == 1000){
        var data =d.data;
        var otherNum = 0
        if(data.viewers){
            otherNum = data.num - data.viewers.length
        }

        self.setData({
          loading: false,
          user: {
            total: data.num || 0,
            avatar: data.avatar,
            nickName: data.nickName,
            goldNum: data.goldNum,
            anchorId: data.anchorId,
            viewers: data.viewers || [],
            otherNum: otherNum
          }
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
   * 获取视频信息
   */
  getVideoInfo(options) {
    app.qbaolive.getApi('v1/live/status/wap/'+options.vodId, 'get', {})
    .then(d => {
      if(d.responseCode == 1000){
        let result = d.data;
        let type = parseInt(result.type);
        let isLive = true;
        let pullurl = '';
 
        if (type == 0) { //直播
          isLive = true;
          pullurl = result.pullUrl;
        } else {
          isLive = false;
          pullurl = result.playBackUrl;
        }

        this.setData({
          video:{
            isLive:isLive,
            url:pullurl,
            sourceWay:result.sourceWay
          },
          loading: false
        })
        //提示
        if(pullurl == ''){
           app.wechat.showModal('视频源不存在!')
        }
      }else{
        var errorMsg = d.errorMsg;
        app.wechat.showModal(errorMsg)
        
      }
    })
    .catch(e => {
      this.setData({
          loading: false
      });
     
      console.error(e)
    })
  },
    /**
   * 在线用户列表
   */
    userOnline(options) {
      this.page = 1 ;
       app.qbaolive.getApi('broadcast/onlinemembers.html', 'post', {page:this.page,vodId: options.vodId, pageSize: 15})
       .then(d => {
           if (d.responseCode === 1000) {
            this.setData({
              userList:  this.data.userList.concat(d.data.members),
              onlineNum: d.data.views
            })
             this.page += 1;
           }
       })
     
    },
  /**
   * 视频时间更新
   */ 
  videoUpdate(event) {
    this.setData({
      currentTime:this.time(event.detail.currentTime)
    })
  },
  time(second){
    return [parseInt(second / 60 % 60), parseInt(second % 60)].join(":").replace(/\b(\d)\b/g, "0$1");
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {

    this.videoContext = wx.createVideoContext('liveAudio');
    
    // this.setData({
    //   subtitle: '加载中...',
    //   loading: true
    // })

    //获取视频信息
    this.getVideoInfo(options)
    // 获取用户信息
    this.getUserInfo(options)
    // 获取金币
    // this.getGold(options)
   
    
    //分享
    wx.showShareMenu()
    var query = 'vodId='+options.vodId+'&userId='+options.userId;
    app.onShareAppMessage('/pages/audioLiveDetail/index',query)
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
  }
})
