var utils = require("../../utils/util.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = options.id,
      type = options.type;
    this.setData({
      id,
      type
    })
  },

  direct_login: function(event) { //直接登入;
    var id = this.data.id,
      type = this.data.type;
    wx.navigateTo({
      url: '../login_page/login_page'
    });
  },
  getPhoneNumber: function(event) { //立即绑定;
    if (!event.detail.errMsg || event.detail.errMsg != "getPhoneNumber:ok") {
      wx.showModal({
        title: '提示',
        content: '无法获取手机号码',
        showCancel: false
      })
      return;
    }
    var encryptedData = event.detail.encryptedData,
      iv = event.detail.iv,
      sessionkey = wx.getStorageSync("session_key"),
      url = app.globalData.lexue + "/api/mobile/wxapp/user_bind",
      id = this.data.id,
      type = this.data.type,
      that = this,
      data = {
        CnfApiType: "wxapp",
        CnfApiName: "user_bind",
        use_for: "wxapp",
        encryptedData,
        sessionkey,
        iv
      };
    utils.http(url, data, res => {
      var code = res.data.code,
        authCookie = res.data.data.auth_cookie;
      if (code == '200') {
        wx.setStorageSync("authCookie", authCookie);
        wx.navigateBack({
          delta: 1
        });
      } else {
        wx.navigateTo({
          url: '../login_page/login_page'
        });
      }
    });
  }
})