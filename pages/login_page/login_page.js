
import {Login} from 'login_page_model.js';
var login = new Login();

Page({

  /**
   * 页面的初始数据
   */
  data: {
     code:true,  //获取验证码颜色 
     username:null,  //电话号码
     passWord:null, //密码
     registerHide:false  //是否隐藏注册按钮;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData(options);
  },
  _loadData:function(options){
      var isHide = options.id;
      if(isHide){
        this.setData({
          registerHide: isHide
        });
      }
  },
  onPhoneCode:function(event){  //判断手机号
    var username = event.detail.value;
    if (username){
        this.setData({
          username
        });
    }else{
      this.setData({
        username:null
      })
    }

  },
  onPhonePassWord:function(event){ //判断密码
    var passWord = event.detail.value;
    if(passWord){
      this.setData({
        passWord
      });
    }else{
      this.setData({
        passWord:null
      });
    }

  },
  onBindRegister:function(event){
      wx.navigateTo({
        url:'../register_page/register_page'
      })
  },
  onBindLogin:function(event){
      var username = this.data.username,
          passWord = this.data.passWord,
          openId = wx.getStorageSync("openId");
        var data= {
          username,
          passWord,
          openId
        };    
    if (username && passWord){
        login._login(data,res=>{
          var code = res.code;
          if(code == 200){
            var authCookie = res.data.auth_cookie;
            wx.setStorageSync('authCookie', authCookie); //区分替换不同的登入者
            wx.setStorageSync('loginSuccess',true);  //用来判断是否登入成功，登入成功之后用来刷新首页数据
            wx.navigateBack({
              delta:2
            });
          }else{
            wx.showToast({
              title: res.desc,
              icon: 'none',
              duration: 2000
            });
          }
        });
      }else{
        wx.showToast({
          title: '用户名和密码不能为空',
          icon: 'none',
          duration:2000
        });
      }
  }
})