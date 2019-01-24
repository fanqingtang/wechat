App({
  onLaunch: function() {
    //登录
    var token = wx.getStorageSync("authCookie");
    if(!token){
      this.loginFn().then(function (res) {
        var sessionKey = res.session_key,
          openId = res.openid,
          authCookie = res.auth_cookie;
        wx.setStorageSync("session_key", sessionKey);
        wx.setStorageSync("openId", openId);
        wx.setStorageSync("authCookie", authCookie);
      }).catch(function (err) {
        console.log(err);
      });
    }
  },
  loginFn:function(){
    var that = this;
    return new Promise(function(resolve,reject){
      wx.login({
        success: res => {
          var code = res.code;
          wx.request({
            url: that.globalData.lexue + "/api/mobile/wxapp/user_openid",
            data: {
              CnfApiType: "wxapp",
              CnfApiName: "user_openid",
              use_for: "wxapp",
              code: code,
              checkbind: "1"
            },
            method: "POST",
            header: {
              "content-type": "application/json"
            },
            success: function (res) {
              var data = res.data.data;
              resolve(data);
            },
            fail:function(err){
              reject(err);
            }
          })
        }
      })
    });
  },
  globalData: {
    userInfo: null,
    lexue: "https://pangu.lexue100.com"
  }
})