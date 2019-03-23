// pages/comment/comment.js
const util = require('../../../utils/util.js')

Page({
  data: {
    hh:'',
    mm:'',
    feedback:"",
  },

  onLoad: function(options) {
    this.setData({
      hh: options.hh,
      mm: options.mm
    })
  },

  bindTextAreaBlur(e){
    this.setData({
      feedback: e.detail.value
    });
    console.log(this.data.feedback);
  },

  complete(e){
    // util.addFormId(e.detail.formId);
    if(this.data.feedback!=""){
      // this.toHome();
      wx.showToast({
        title: "感谢反馈:)",
        icon: 'none',
        duration: 2000
      })
    }else{
      // this.toHome();
    }
    wx.require

  },

  toHome() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  }

})