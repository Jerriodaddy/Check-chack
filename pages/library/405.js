// pages/library/405.js
const app = getApp();

Page({

  data: {
    userInfo:{},
    r405_statu: {},
    checkSeat: ''
  },
  
  onLoad: function (options) {
    this.popup = this.selectComponent("#popup");
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
        // success
        //console.log(res.data);
        that.setData({ r405_statu: res.data });
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
  
  checkThis: function (e) {
    var that = this;
    var this_checked = e.currentTarget.dataset.id;
    var r405_statuList = that.data.r405_statu;
    for (var i = 0; i < r405_statuList.length; i++) {
      if (r405_statuList[i].seat_id == this_checked) {
        r405_statuList[i].checked = true;//当前点击的位置为true即选中
      }
      else {
        r405_statuList[i].checked = false;//其他的位置为false
      }
    }
    that.setData({
      checkSeat: this_checked,
      r405_statu: r405_statuList
    })
  },

  submit: function(){
    this.popup.showPopup();
  },

  //Popup ok
  _success() {
    console.log('Click OK');
    var that = this;
    wx.request({
      url: 'http://localhost/CheckChackServer/selectSeat.php',
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
  }
})