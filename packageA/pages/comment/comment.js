// pages/comment/comment.js
const util = require('../../../utils/util.js');
const app = getApp();

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
      this.toHome();
      wx.showToast({
        title: "感谢反馈:)",
        icon: 'none',
        duration: 2000
      })

      var that=this;
      wx.request({
        url: app.globalData.serverAddress + '/CheckChackServer/addFeedback.php',
        data: {
          openId: app.globalData.openid,
          feedback: that.data.feedback,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          console.log("Added feedback: " + that.data.feedback);
        },
        fail: function () {
          console.log("Can not connect to the sever.");
        }
      })
    }else{
      this.toHome();
    }
  },

  toHome() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  }

})