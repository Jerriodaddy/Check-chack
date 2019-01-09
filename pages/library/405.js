// pages/library/405.js
const app = getApp();
var mapsize = 320;
// var room_seats_map_y = new Array();
// var room_seats_map_x = new Array();
Page({

  data: {
    userInfo:{},
    room_seats_map:{},
    checkSeat: ''
  },
  
  onLoad: function (options) {
    this.popup = this.selectComponent("#popup");
    this.zoomImgByView = this.selectComponent("#zoomImgByView");
    this.setData({
      userInfo: app.globalData.userInfo,

      //for zoomImgByView component
      viewHeight: 400,
      viewWidth: 400,
      imgSrc: "http://127.0.0.1/CheckChackServer/image/r405.png"
    })

    //for zoomImgByView component
    // wx.getSystemInfo({
    //   success: res => {
    //     this.setData({
    //       viewHeight: res.windowHeight,
    //       viewWidth: res.windowWidth,
    //       imgSrc: "http://www.checkchack.cn/CheckChackServer/image/r405.png"
    //     })
    //   }
    // })

    var that = this;
    wx.request({
      url: 'http://127.0.0.1/CheckChackServer/CheckChackDB.php',//此处填写你后台请求地址
      method: 'GET',
      header: { 'Accept': 'application/json' },
      data: {},
      success: function (res) {
        // initialize map
        // for(var y=0; y<mapsize; y++){
        //   for(var x=0; x<mapsize; x++){
        //     room_seats_map_x.push(0);
        //   }
        //   room_seats_map_y.push(room_seats_map_x[y])
        // }
        
        // for(var i=0; i<res.data.length; i++){
        //   var y = res.data[i].loca_y;
        //   var x = res.data[i].loca_x;
        //   room_seats_map_y.splice(x, 1, res.data[i]);
        // }
        that.setData({ room_seats_map: res.data });
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
    var room_seats_mapList = that.data.room_seats_map;
    for (var i = 0; i < room_seats_mapList.length; i++) {
      if (room_seats_mapList[i].seat_id == this_checked) {
        room_seats_mapList[i].checked = true;//当前点击的位置为true即选中
      }
      else {
        room_seats_mapList[i].checked = false;//其他的位置为false
      }
    }
    that.setData({
      checkSeat: this_checked,
      room_seats_map: room_seats_mapList
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
      url: 'http://127.0.0.1/CheckChackServer/selectSeat.php',
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
  },

})