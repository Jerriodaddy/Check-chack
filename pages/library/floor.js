// pages/library/floor.js
Page({
  data: {
    buttonSize: 15,
    b1: 'F1',
    b2: 'F2'
  },

  goto405: function () {
    wx.navigateTo({
      url: 'room',
    })
  },

  quickstart: function(){
    wx.navigateTo({
      url: '../quickstart/quickstart',
    })
  }

})