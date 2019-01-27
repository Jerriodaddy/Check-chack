//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    item_list:{}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (res) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    //User checkin
    if (res.scene) {
      const scene = decodeURIComponent(res.scene);
      var that = this;
      var interval = setInterval(
        function () {
          if (app.globalData.openid==null){
            console.log("waiting openid...");
          }else{
            clearInterval(interval);
            console.log("get openid = "+app.globalData.openid);
            that.checkin(scene);
          }
        }
      , 1000);
    } else {
      console.log("no scene");
    }
  },

  checkin: function (scene){
    console.log("scene = "+scene);
    wx.request({
      url: 'http://127.0.0.1/CheckChackServer/checkin.php',
      data: {
        scan_seat: scene, //this will be set by scan QR cody
        openId: app.globalData.openid,
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      success: function (res) {
        console.log(res.data);
      },
      fail: function (res) {
        console.log("Can not connect to the sever.");
      }
    })
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  gotoLibrary: function(){
    wx.navigateTo({
      url: '/pages/library/room',
    })
  }


})
