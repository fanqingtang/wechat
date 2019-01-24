import {
  MyPage
} from "./my_page_model.js";
var myPage = new MyPage(); //实例化MyPage对象;

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
    this._loadData();
  },

  _loadData: function() {
    var authCookie = wx.getStorageSync("authCookie");
    if (authCookie) {
      myPage._getUserInfo(res => { //获取用户信息
        this.setData({
          studentInfo: res,
          isLogin: true
        });
      });
    } else {
      this.setData({
        isLogin: false
      });
    };

  },
  onChangeUser: function(event) { //切换用户 
    myPage._changeUser(res => {
      var code = res.code;
      if (code == 200) {
        wx.navigateTo({
          url: '../login_page/login_page?id=true'
        })
      };
    });
  },
  onLogin: function(event) { //登入
    wx.navigateTo({
      url: '../login_page/login_page'
    });
  },
  onBindTap: function(event) { //我的订单
    wx.navigateTo({
      url: '../my_order_list/my_order_list'
    });
  },
  onBindCoupon:function(event){ //我的优惠券
    wx.navigateTo({
      url: '../developing_page/developing_page'
    });
  },
  onShow: function(event) {
    app.loginFn().then(res => {
      var sessionKey = res.session_key,
        openId = res.openid,
        authCookie = res.auth_cookie;
      wx.setStorageSync("session_key", sessionKey);
      wx.setStorageSync("openId", openId);
      if (authCookie) {
        wx.setStorageSync("authCookie", authCookie);
      }
      this._loadData();
    });
    var registerSuccess = wx.getStorageSync("registerSuccess");
    if (registerSuccess == "注册成功") {
      wx.showToast({
        title: "注册成功",
        icon: 'success',
        duration: 2000
      });
      wx.removeStorageSync('registerSuccess');
    }
  }

})