// pages/library/405.js
const app = getApp();
const util = require('../../../utils/util.js');

Page({
  data: {
    userInfo: {},
    room: '',
    room_seats_map: {},
    checkSeat: 'NULL'
  },

  onLoad: function(option) {
    console.log("room=" + option.room)
    this.popup = this.selectComponent("#popup");
    this.zoomImgByView = this.selectComponent("#zoomImgByView");
    this.setData({
      userInfo: app.globalData.userInfo,
      room: option.room
    })
    //for zoomImgByView component
    var that = this;
    wx.getSystemInfo({
      success: res => {
        that.setData({
          viewHeight: res.windowHeight,
          viewWidth: res.windowWidth,
          imgSrc: app.globalData.serverAddress+"/CheckChackServer/image/r405.jpg",
        })
      }
    })
  },

  onShow:function(){
    this.reflash();
  },

  reflash:function(){
    var that = this;
    wx.request({
      url: app.globalData.serverAddress+'/CheckChackServer/showRoom.php',//此处填写你后台请求地址
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        target: that.data.room
      },
      success: function (res) {
        that.setData({
          room_seats_map: res.data
        })
      },
      fail: function (res) {
        console.log("Can not connect to the sever.");
      }
    })
  },

  _checkThis: function(e) {
    this.setData({
      checkSeat: e.detail
    })
  },

  formSubmit: function(e) {
    console.log("e.formId="+e.detail.formId);
    this.setData({
      formId: e.detail.formId
    })
    util.addFormId(e.detail.formId);
    this.popup.showPopup();
  },

  //Popup ok
  _success() {
    console.log('Click OK');
    if (this.data.checkSeat == 'NULL'){
      wx.showToast({
        title: "You haven't chosen a seat.",
        icon: 'none',
        duration: 2000
      })
      this.popup.hidePopup();
      return;
    }
    var that = this;
    wx.request({
      url: app.globalData.serverAddress+'/CheckChackServer/selectSeat.php',
      data: {
        checked_seat: that.data.checkSeat,
        openId: app.globalData.openid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function(res) {
        console.log(res.data);
        that.reflash();
        var buf = res.data.split(';');
        switch(buf[0]){
          case "409":
            wx.showToast({
              title: res.data,
              icon: 'none',
              duration: 2000
            })
            break;
          case "406":
            wx.showToast({
              title: res.data,
              icon: 'none',
              duration: 2000
            })
            break;
          case "200":
            //sendTemplateMessage
            wx.showToast({
              title: 'Success',
              icon: 'success',
              duration: 2000
            })
            break;
          default:
            wx.showToast({
              title: "Server Error",
              icon: 'none',
              duration: 2000
            })
        }
        
      },
      fail: function (res) { console.log("Can not connect to the sever."); }
    })
    this.popup.hidePopup();
    this.reflash();
  },

  _error() {
    console.log('Click Cancel');
    this.popup.hidePopup();
  },

  checkin: function () {
    var that = this;
    wx.request({
      url: app.globalData.serverAddress+'/CheckChackServer/checkin.php',
      data: {
        scan_seat: that.data.checkSeat, //this will be set by scan QR cody in the future
        openId: app.globalData.openid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        var buf = res.data.split(';');
        console.log(buf);
        switch (buf[0]) {
          case "200": //seat
            wx.navigateTo({
              url: '/packageA/pages/study/study',
            });
            break;
          case "300": //kick out
            console.log(buf[1]); //need a popup in the future
            //if Yes
            wx.showModal({
              title: 'Prompt',
              content: buf[1],
              cancelText: 'Cancel',
              confirmText: 'Comfirm',
              success(res) {
                if (res.confirm) {
                  console.log("operating");
                  wx.request({
                    url: app.globalData.serverAddress + '/CheckChackServer/setOperating.php',
                    data: {
                      scan_seat: that.data.checkSeat, //this will be set by scan QR cody in the future
                      openId: app.globalData.openid,
                    },
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    method: 'POST',
                    success: function (res) {
                      console.log(res.data);
                      wx.showToast({
                        title: 'Success',
                        icon: 'success',
                        duration: 2000
                      })
                      that.reflash();
                    },
                    fail: function (res) {
                      console.log("Can not connect to the sever.");
                    }
                  })
                } else if (res.cancel) {
                  console.log('Click cancel')
                }
              }
            })
            break;
          case "406":
            wx.showToast({
              title: res.data,
              icon: 'none',
              duration: 2000
            })
            break;
          default:
            console.log(buf);
        }

      },
      fail: function (res) {
        console.log("Can not connect to the sever.");
      }
    })
  },

  checkout: function () {
    var that = this;
    wx.request({
      url: app.globalData.serverAddress+'/CheckChackServer/checkout.php',
      data: {
        openId: app.globalData.openid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data);
        that.reflash();
      },
      fail: function (res) {
        console.log("Can not connect to the sever.");
      }
    })
  },
})