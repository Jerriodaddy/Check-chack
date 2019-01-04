//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'CheckChack',
    b1: '开始选座',
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
  onLoad: function () {
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

    //连接Seats数据库
    var that = this;
    wx.request({
      url:'http://localhost:80/CheckChackServer/CheckChackDB.php',//此处填写你后台请求地址
      method: 'GET',
      header: {'Accept': 'application/json' },
      data: {},
      success: function (res) {
        // success
        //console.log(res.data);
        that.setData({ item_list: res.data });
      },
      fail: function (res) {
        console.log("Can not connect to the sever.");
        // fail
      },
      complete: function (res) {
        // complete
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
      url: '/pages/library/405',
    })
  }


})
