// pages/study/study.js
const app = getApp();
var interval_num;
var hh = 0;
var mm = 0;
var ss = 0;
Page({
  data: {
    counter: '00:00:00'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.timer();
  },

  checkout: function () {
    var that = this;
    wx.request({
      url: app.globalData.serverAddress +'/CheckChackServer/checkout.php',
      data: {
        openId: app.globalData.openid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data);
        clearInterval(interval_num);
        wx.navigateTo({
          url: '../comment/comment?hh='+hh+'&mm='+mm,
        })
      },
      fail: function (res) {
        console.log("Can not connect to the sever.");
      }
    })
  },

  //计时器
  timer: function(){
    var that = this;
    interval_num = setInterval(
      function(){
        that.format();
      },1000);
  },

  format: function(){
    ss++;
    if(ss == 59){
      ss = 0;
      mm++;
    }
    if(mm == 59){
      mm = 0;
      hh++;
    }
    var form = (hh<10?'0'+hh:hh) + ":" + (mm<10?'0'+mm:mm) + ":" + (ss<10?'0'+ss:ss);
    this.setData({ counter: form });
  }
})