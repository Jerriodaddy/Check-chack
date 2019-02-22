//app.js
App({
  globalData: {
    userInfo: null,
    openid: null,
    serverAddress:'https://www.checkchack.cn'
    // serverAddress: 'http://127.0.0.1'
  },

  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var that = this;
        wx.request({
          url: 'https://www.checkchack.cn/CheckChackServer/login.php', //接口地址
          data: { code: res.code },
          header: {
            'content-type': 'application/json' //默认值
          },
          method: 'GET',
          success: function (res) {
            console.log(res.data.openid);
            that.globalData.openid = res.data.openid;
            if (that.globalData.openid==null){
              console.log("openId is null");
            }else{
              //Is new user?
              wx.request({
                url: 'https://www.checkchack.cn/CheckChackServer/createUser.php',
                
                data: {
                  openId: res.data.openid,
                },
                header: { 'content-type': 'application/x-www-form-urlencoded' },
                method: 'POST',
                success: function (res) {
                  console.log(res.data);
                },
                fail: function (res) {
                  console.log("Can not connect to the sever.");
                }
              })
            }
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionIda
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  }
})