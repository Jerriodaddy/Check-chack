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

    popupContent: 'Checkin result',
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
    this.popup = this.selectComponent("#popup");
    var that = this;
    wx.request({
      url: app.globalData.serverAddress + '/CheckChackServer/checkin.php',
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
        that.setData({
          popupContent:buf
        })
        that.popup.showPopup();//pop the comfirm window
      },
      fail: function (res) {
        console.log("Can not connect to the sever.");
      }
    })
  },

  _success() {
    wx.request({
      url: app.globalData.serverAddress + '/CheckChackServer/addForm_id.php',
      data:{
        openId: app.globalData.openid,
        form_id: this.popup.data.formId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function(res){
        console.log("Added formId.");
      },
      fail: function () {
        console.log("Can not connect to the sever.");
      }
    })

    var buf = this.data.popupContent;
    var that = this;
    switch (buf[0]) {
      case "200": //seat
        wx.navigateTo({
          url: '/packageA/pages/study/study',
        });
        break;
      case "300": //kick out
        //if Yes
        console.log("operating");
        wx.request({
          url: app.globalData.serverAddress + '/CheckChackServer/setOperating_A.php',
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
            wx.showToast({
              title: 'Success',
              icon: 'success',
              duration: 2000
            })
            //asking loop
            // interval_num = setInterval(that.checkstate, interval_time, 2);
            wx.request({
              url: app.globalData.serverAddress + '/CheckChackServer/kickoutTimer.php',
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
              },
              fail: function (res) {
                console.log("Can not connect to the sever.");
              }
            })
          },
          fail: function (res) {
            console.log("Can not connect to the sever.");
          }
        })
        break;
      case "406":
        break;
      default:
    }
    console.log('Click OK');
    this.popup.hidePopup();
  },
  _error() {
    console.log('Click Cancel');
    wx.request({
      url: app.globalData.serverAddress + '/CheckChackServer/addForm_id.php',
      data: {
        openId: app.globalData.openid,
        form_id: this.popup.data.formId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        console.log("Added formId.");
      },
      fail: function () {
        console.log("Can not connect to the sever.");
      }
    })
    this.popup.hidePopup();
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