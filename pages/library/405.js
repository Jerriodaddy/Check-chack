// pages/library/405.js
const app = getApp();
Page({

  data: {
    userInfo:{},
    room_seats_map:{},
    checkSeat: ''
  },
  
  onLoad: function (options) {
    this.popup = this.selectComponent("#popup");
    this.zoomImgByView = this.selectComponent("#zoomImgByView");
    this.setData({
      userInfo: app.globalData.userInfo,
    })

    var that = this;
    wx.request({
      url: 'https://www.checkchack.cn/CheckChackServer/CheckChackDB.php',//此处填写你后台请求地址
      method: 'GET',
      header: { 'Accept': 'application/json' },
      data: {},
      success: function (res) {
        that.setData({ room_seats_map: res.data })

        //for zoomImgByView component
        wx.getSystemInfo({
          success: res => {
            that.setData({
              viewHeight: res.windowHeight,
              viewWidth: res.windowWidth,
              imgSrc: "https://www.checkchack.cn/CheckChackServer/image/r405.png",
            })
          }
        })
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

  submit: function(){
    this.popup.showPopup();
  },

  _checkThis: function(e){
    this.setData({ checkSeat: e.detail })
  },

  //Popup ok
  _success() {
    console.log('Click OK');
    var that = this;
    wx.request({
      url: 'https://www.checkchack.cn/CheckChackServer/selectSeat.php',
      data: {
        checked_id: that.data.checkSeat,
        user_info: that.data.userInfo.nickName,
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      success: function (res) {
        console.log("Select seat successfully.");
      },
      fail: function (res) {
        console.log("Can not connect to the sever.");
      },
      complete: function (res) {
      },
    })
    this.popup.hidePopup();
    wx.showToast({
      title: 'Success',
      icon: 'success',
      duration: 2000
    })
    this.onLoad();
  },
  _error() {
    console.log('Click Cancle');
    this.popup.hidePopup();
  },

})