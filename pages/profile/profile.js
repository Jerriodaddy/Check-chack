// pages/profile/profile.js
const app = getApp()

Page({
  data: {
    userInfo: {}, //get by wx
    myUserInfo: {}, //get from CheckChackDB
    edit: false,
    setMyUserInfo: {
      name: 'default',
      studentId: 'default',
      gender: '2',
      phone: 'default',
      year: '1',
      major: 'default',
      motto: 'default'
    },

    genderArray: ['Female', 'Male', 'Others'],
    genderIndex: 0,
    yearArray: ['Y1', 'Y2', 'Y3', 'Y4', 'Graduate'],
    yearIndex: 0
  },

  onLoad: function (options) {
    var that = this;
    var interval = setInterval(
      function () {
        if (app.globalData.openid == null) {
          console.log("waiting openid...");
        } else {
          clearInterval(interval);
          wx.request({
            url: app.globalData.serverAddress +'/CheckChackServer/getThisUserInfo.php',
            data: {
              openId: app.globalData.openid,
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: 'POST',
            success: function (res) {
              console.log(res.data);
              that.setData({
                userInfo: app.globalData.userInfo,
                myUserInfo: res.data,
                genderIndex: res.data.gender,
                yearIndex: res.data.year
              })
            },
            fail: function (res) {
              console.log("Can not connect to the sever.");
            }
          })
        }
      }
      , 500);
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
    })
  },

  edit: function(){
    this.setData({edit: true})
  },

  formSubmit: function(e){
    this.setData({ 
      edit: false,
      ["setMyUserInfo.name"]: e.detail.value.name,
      ["setMyUserInfo.studentId"]: e.detail.value.studentId,
      ["setMyUserInfo.gender"]: this.data.genderIndex,
      ["setMyUserInfo.phone"]: e.detail.value.phone,
      ["setMyUserInfo.year"]: this.data.yearIndex,
      // ["setMyUserInfo.major"]: e.detail.value.major,
      ["setMyUserInfo.motto"]: e.detail.value.motto
    })
    console.log(this.data.setMyUserInfo);
    //send to server
    var that = this;
    wx.request({
      url: app.globalData.serverAddress+'/CheckChackServer/updateThisUser.php',
      data: {
        openId: app.globalData.openid,
        name: this.data.setMyUserInfo.name,
        studentId: this.data.setMyUserInfo.studentId,
        gender: this.data.setMyUserInfo.gender,
        phone: this.data.setMyUserInfo.phone,
        year: this.data.setMyUserInfo.year,
        // major: 'default',
        motto: this.data.setMyUserInfo.motto
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      success: function (res) {
        console.log(res);
        that.onLoad();
      },
      fail: function (res) {
        console.log("Can not connect to the sever.");
      }
    })
  },

  genderChange: function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      genderIndex: e.detail.value
    })
  },

  yearChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      yearIndex: e.detail.value
    })
  }
})