
// pages/library/floor.js
const app = getApp();

Page({
  data: {
    buttonSize: 15,
    floorInfo: {},
    floorSeats: {}
  },

  onLoad: function(option){
    var floorInfo = JSON.parse(option.floorInfo);
    this.setData({
      floorInfo: floorInfo
    });
    this.getSeats(floorInfo.space_num,"floorSeats", "2");
  },

  getSeats: function (search_target = 'default', setArrayName, accuracy = '1') {
    var that = this;
    wx.request({
      url: app.globalData.serverAddress +'/CheckChackServer/searchSeats.php',
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
        console.log(res.data)
      },
      fail: function (res) {
        console.log("Can not connect to the sever.");
      }
    })
  },

  toRoom: function (e) {
    var room = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'room?room='+room,
    })
  },

  quickstart: function(){
    wx.navigateTo({
      url: '../quickstart/quickstart',
    })
  }

})