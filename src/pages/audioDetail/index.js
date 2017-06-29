// 获取全局应用程序实例对象
const app = getApp()
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    viewNum:0, //回播观看人数
    user:{
      total:0,
      avatar: "",
      nickName: "",
      goldNum: 0,
      anchorId: '',
      viewers: [],
      otherNum:0
    },
    audio:{
      surfaceImg:'',
      isLive:true,
      url:'',
      sourceWay:1 //手机来源
    },
    page:1,
    userList:[],
    //audio参数
    initX: 0,
    offsetX: 0,
    barWidth: 0,
    offsetLeft: 0,
    currTime: '0',
    durationTime: '0',
    progress: false,
    offsetLeft: 0,
    windowWidth:0,
    pause:false,
    play:true,
    currentTimeText:'00:00',
    durationTimeText:'00:00'
  },
   time(second){
       return [parseInt(second / 60 % 60), parseInt(second % 60)].join(":").replace(/\b(\d)\b/g, "0$1");
  },
  ontouchStart(event) {
    var target = event.touches[0];
      this.setData({
        initX:target.pageX
    })
    // event.preventDefault();
  },
  ontouchMove(event) {
    // event.preventDefault();
  },
  ontouchEnd(event) {
    var offsetWidth = this.data.windowWidth;
    var setTime = (this.data.durationTime / offsetWidth) *  this.data.initX
    this.audioCtx.seek(setTime)

    if (this.pause) {
      this.audioCtx.play();
    }
 
  },
  audioPlay() {
    this.audioCtx.play()
    this.audioState()
    

    console.log('play')
  },
  audioPause() {
    this.audioCtx.pause()
    this.audioState()
  },
  audioState:function(){
    this.setData({
        play: !this.data.play,
        pause: !this.data.pause
    }) 
  },
  audioError(event) {

    var errMsg = event.detail.errMsg;
    var errText = ''

    switch (errMsg) {
      case 'MEDIA_ERR_ABORTED':
        errText = '获取资源被用户禁止'
        break;
      case 'MEDIA_ERR_NETWORD':
        errText = '网络错误'
        break;
      case 'MEDIA_ERR_DECODE':
        errText = '解码错误'
        break;
      default:
        errText = '资源无效'
        break;
    }

    app.wechat.showModal(errText);
    this.setData({
      loading: false
    })
  },
  //监控音频时间
  audioUpdate(event){

     //当目前的播放位置已更改时
      var offsetWidth = this.data.windowWidth  - 13;
      var setWidth = parseFloat((event.detail.currentTime/event.detail.duration) * offsetWidth);
      if(setWidth <= 0){
          setWidth = 0;
      } 
      if (setWidth >= offsetWidth){
         setWidth = offsetWidth;
      }

      this.setData({
          currTime:event.detail.currentTime,
          barWidth:setWidth,
          offsetLeft:setWidth,
          durationTime:event.detail.duration,
          currentTimeText:this.time(event.detail.currentTime),
          durationTimeText:this.time(event.detail.duration),
      })
      //开始播放时隐藏loading
      if(this.data.loading){
        this.setData({
          loading: false
        })
      }
      
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
        // pullurl = 'http://audio.xmcdn.com/group27/M00/C2/E0/wKgJW1kZcqrQqk7pAH9sG6exyBo867.m4a'
        this.setData({
          viewNum:result.viewNum,
          audio:{
            surfaceImg:result.surfaceImg,
            isLive:isLive,
            url:pullurl,
            sourceWay:result.sourceWay
          },
          // loading: false
        })
        //提示
        if(pullurl == ''){
           app.wechat.showModal('音频源不存在!')
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
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    //获取屏幕信息
    var self = this;
    wx.getSystemInfo({
      success: function(res) {
        self.setData({
          windowWidth:res.windowWidth
        })
      }
    });
    //音频
    this.audioCtx = wx.createAudioContext('myAudio');
    this.audioPlay();


    this.setData({
      loading: true
    })
    // 获取用户信息
    this.getVideoInfo(options)
    this.getUserInfo(options)
 
   
    
      //分享
     wx.showShareMenu()
    var query = 'vodId='+options.vodId+'&userId='+options.userId;
    app.onShareAppMessage('/pages/audioDetail/index',query)
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
