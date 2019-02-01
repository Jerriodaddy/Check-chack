//index.js
//获取应用实例
const app = getApp()
// const util = require('/utils/util');

var interval_num; // for setInterval()
var interval_time = 3000; //10s=10000
var interval_total = 20000; //5mins=300000
var interval_i = interval_total;

Page({
  data: {
    imgUrls: [
      'https://www.checkchack.cn/CheckChackServer/image/Pic1.jpg',
      'https://www.checkchack.cn/CheckChackServer/image/Pic2.png',
      'https://www.checkchack.cn/CheckChackServer/image/Pic3.jpg'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    scene: '',
    librarySeats: {},

    // userInfo: {},
    // hasUserInfo: false,
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  //事件处理函数 (右上角)
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function(res) {
    /**********GET USER INFO***********
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
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
    **********************************/

    //User checkin
    if (res.scene) {
      const scene = decodeURIComponent(res.scene);
      this.setData({ scene: scene });
      var that = this;
      var interval = setInterval(
        function () {
          if (app.globalData.openid==null){
            console.log("waiting openid...");
          }else{
            clearInterval(interval);
            console.log("get openid = "+app.globalData.openid);
            that.checkin();
          }
        }
      , 1000);
    } else {
      console.log("no scene");
    }
  },

  onShow: function () {
    //get num and percentage of free seat
    this.getSeats("L", "librarySeats", "1");
  },

  getSeats: function (search_target = 'default', setArrayName, accuracy = '1'){
    var that = this;
    wx.request({
      url: app.globalData.serverAddress+'/CheckChackServer/searchSeats.php',
      data: {
        target: search_target,
        accuracy: accuracy
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      success: function (res) {
        that.setData({
          [setArrayName]: res.data
        })
        console.log(that.data.librarySeats)
      },
      fail: function (res) {
        console.log("Can not connect to the sever.");
      }
    })
  },

  toFloor(e) {
    var index = e.currentTarget.dataset.id;
    var floorInfo = JSON.stringify(this.data.librarySeats[index]);
    console.log(floorInfo)
    wx.navigateTo({
      url: '/packageA/pages/library/floor?floorInfo=' + floorInfo
    })
  },

  //Checkin
  checkin: function () {
    console.log("scene = " + this.data.scene);
    var that = this;
    wx.request({
      url: app.globalData.serverAddress+'/CheckChackServer/checkin.php',
      data: {
        scan_seat: that.data.scene, //this will be set by scan QR cody in the future
        openId: app.globalData.openid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        var buf = res.data.split(';');
        console.log(buf);
        switch (buf[0]){
          case "200": //seat
            wx.navigateTo({
              url: '/packageA/pages/study/study',
            });
            break;
          case "300": //kick out
            console.log(buf[1]); //need a popup in the future
            //if Yes
            console.log("operating");
            wx.request({
              url: app.globalData.serverAddress+'/CheckChackServer/setOperating_A.php',
              data: {
                scan_seat: that.data.scene, //this will be set by scan QR cody in the future
                openId: app.globalData.openid,
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              method: 'POST',
              success: function (res) {
                console.log(res.data);
                // that.onLoad();
                //asking loop
                interval_num = setInterval(that.checkstate, interval_time, 2);
              },
              fail: function (res) {
                console.log("Can not connect to the sever.");
              }
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

  checkstate(e_state = null, e_user = null) {
    var that = this;
    wx.request({
      url: app.globalData.serverAddress+'/CheckChackServer/checkState_B.php',
      data: {
        scan_seat: that.data.scene, //this will be set by scan QR cody in the future
        expect_state: e_state,
        expect_user: e_user,
        openId: app.globalData.openid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        console.log(res);
        // that.onLoad();
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
            url: app.globalData.serverAddress+'/CheckChackServer/kick_C.php',
            data: {
              scan_seat: that.data.scene, //this will be set by scan QR cody in the future
              openId: app.globalData.openid,
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
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
                default:
                  console.log(buf);
              }
              // that.onLoad();
            },
            fail: function (res) { console.log("Can not connect to the sever."); }
          })
          clearInterval(interval_num);
          return;
        }
        console.log(interval_i);
      },
      fail: function (res) {
        console.log("Can not connect to the sever.");
      }
    })
  },

  // getUserInfo: function(e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // },

})