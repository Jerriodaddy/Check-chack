// pages/library/floor.js
Page({
  data: {
    buttonSize: 15,
    b1: 'F1',
    b2: 'F2'
  },

  gotoF1: function () {
    wx.navigateTo({
      url: 'map/f1',
    })
  }

})