// pages/comment/comment.js
Page({
  data: {
    hh:'',
    mm:''
  },

  onLoad: function(options) {
    console.log(options.hh)
    this.setData({
      hh: options.hh,
      mm: options.mm
    })
  },

  toHome() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
})