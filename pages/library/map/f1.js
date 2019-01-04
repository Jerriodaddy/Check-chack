// pages/library/map/f1.js
Page({

  /**
   * Page initial data
   */
  data: {

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'http://localhost:80/CheckChackServer/CheckChackDB.php',//此处填写你后台请求地址
      method: 'GET',
      header: { 'Accept': 'application/json' },
      data: {},
      success: function (res) {
        // success
        //console.log(res.data);
        that.setData({ item_list: res.data });
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

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})