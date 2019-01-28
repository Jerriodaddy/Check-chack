// pages/library/405.js
const app = getApp();
var interval_num; // for setInterval()
var interval_time = 3000; //10s=10000
var interval_total = 15000; //5mins=300000
var interval_i = interval_total;
var reserve_time = 30000 //15mins=9000000
Page({
  data: {
    userInfo: {},
    room_seats_map: {},
    checkSeat: 'NULL'
  },

  onLoad: function(options) {
    this.popup = this.selectComponent("#popup");
    this.zoomImgByView = this.selectComponent("#zoomImgByView");
    this.setData({
      userInfo: app.globalData.userInfo,
    })
    var that = this;
    wx.request({
      url: 'http://127.0.0.1/CheckChackServer/CheckChackDB.php',//此处填写你后台请求地址
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      data: {},
      success: function(res) {
        that.setData({
          room_seats_map: res.data
        })

        //for zoomImgByView component
        wx.getSystemInfo({
          success: res => {
            that.setData({
              viewHeight: res.windowHeight,
              viewWidth: res.windowWidth,
              imgSrc: "http://127.0.0.1/CheckChackServer/image/r405.png",
            })
          }
        })
      },
      fail: function(res) {
        console.log("Can not connect to the sever.");
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
  },

  _checkThis: function(e) {
    this.setData({
      checkSeat: e.detail
    })
  },

  submit: function() {
    this.popup.showPopup();
  },

  //Popup ok
  _success() {
    console.log('Click OK');
    var that = this;
    wx.request({
      url: 'http://127.0.0.1/CheckChackServer/selectSeat.php',
      data: {
        checked_seat: that.data.checkSeat,
        // user_info: that.data.userInfo.nickName,
        openId: app.globalData.openid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function(res) {
        console.log(res.data);
        var buf = res.data.split(';');
        console.log(buf[0]);
        if (buf[0] == 200 || buf[0] == 201){
          //reserving process: check if this seat owner is still this user && state is 1 in 15mins
          //Yes? release the seat and set User state
          setTimeout(that.reservecheck, reserve_time, 1, app.globalData.openid);
        }
      },
      fail: function (res) { console.log("Can not connect to the sever."); }
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
    console.log('Click Cancel');
    this.popup.hidePopup();
  },

  checkin: function() {
    var that = this;
    wx.request({
      url: 'http://127.0.0.1/CheckChackServer/checkin.php',
      data: {
        scan_seat: that.data.checkSeat, //this will be set by scan QR cody in the future
        openId: app.globalData.openid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function(res) {
        that.onLoad();

        //kick out
        var buf = res.data.split(';');
        console.log(buf);
        if (buf[0] == 300) {
          console.log(buf[1]); //need a popup in the future
          //if Yes
          console.log("operating");
          wx.request({
            url: 'http://127.0.0.1/CheckChackServer/setOperating_A.php',
            data: {
              scan_seat: that.data.checkSeat, //this will be set by scan QR cody in the future
              // openId: app.globalData.openid,
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            success: function(res) {
              console.log(res.data);
              that.onLoad();
              //asking loop
              interval_num = setInterval(that.checkstate, interval_time, 2);
            },
            fail: function(res) {
              console.log("Can not connect to the sever.");
            }
          })
        }

      },
      fail: function(res) {
        console.log("Can not connect to the sever.");
      }
    })
  },

  checkstate(e_state = null, e_user = null){
    var that = this;
    wx.request({
      url: 'http://127.0.0.1/CheckChackServer/checkState_B.php',
      data: {
        scan_seat: that.data.checkSeat, //this will be set by scan QR cody in the future
        expect_state: e_state,
        expect_user: e_user
        // openId: app.globalData.openid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        console.log(res);
        that.onLoad();
        if (res.data == true) {
          clearInterval(interval_num);
          console.log("Kick out faild");
          return;
        }
        interval_i = interval_i - interval_time;
        //time out
        if (interval_i < 0) {
          console.log("time out")
          interval_i = interval_total;
          wx.request({
            url: 'http://127.0.0.1/CheckChackServer/kick_C.php',
            data: {
              scan_seat: that.data.checkSeat, //this will be set by scan QR cody in the future
              // user_info: that.data.userInfo.nickName,
              openId: app.globalData.openid,
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: 'POST',
            success: function (res) {
              console.log(res.data);
              that.onLoad();
            },
            fail: function (res) { console.log("Can not connect to the sever."); }
          })
          clearInterval(interval_num);
          return;
        }
        console.log(interval_i);
      },
      fail: function(res) {
        console.log("Can not connect to the sever.");
      }
    })
  },

  reservecheck(e_state = null, e_user = null){
    var that = this;
    wx.request({
      url: 'http://127.0.0.1/CheckChackServer/checkState_B.php',
      data: {
        scan_seat: that.data.checkSeat, //this will be set by scan QR cody in the future
        expect_state: e_state,
        expect_user: e_user
        // openId: app.globalData.openid,
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      success: function (res) {
        console.log(res);
        if (res.data == true) {
          console.log("Reserve faild!");
          wx.request({
            url: 'http://127.0.0.1/CheckChackServer/cancelRsv.php',
            data: {
              openId: app.globalData.openid,
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: 'POST',
            success: function (res) {
              console.log(res);
              that.onLoad();
            },
            fail: function (res) { console.log("Can not connect to the sever."); }
          })
        }
        that.onLoad();
      },
      fail: function (res) { console.log("Can not connect to the sever."); }
    })
  },

  checkout: function() {
    var that = this;
    wx.request({
      url: 'http://127.0.0.1/CheckChackServer/checkout.php',
      data: {
        openId: app.globalData.openid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function(res) {
        console.log(res.data);
        that.onLoad();
      },
      fail: function(res) {
        console.log("Can not connect to the sever.");
      }
    })
  },
  study: function() {
    wx.navigateTo({
      url: '../study/study',
    })
  }
})