import {
  Register
} from 'register_page_model.js';

var register = new Register(); //实例化注册类
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: true, //手机号输入错误的提示
    getCodeText: "获取验证码",
    phoneNum: null, //电话号码
    second: 60, //倒计时60秒
    disabled: false, //禁止点击
    tip: "电话号码格式不正确", //显示提示的信息
    phoneCode: null, //手机验证码
    passWord: null //密码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  onBindPhone: function(event) {
    var phoneNum = event.detail.value;
    var reg = /^1[3,4,5,7,8]\d{9}$/;
    if (phoneNum) {
      if (reg.test(phoneNum)) {
        this.setData({
          code: true,
          phoneNum
        });
      } else {
        this.setData({
          code: false,
          phoneNum: null,
          tip: "电话号码格式不正确"
        });
      }
    } else {
      this.setData({
        code: true
      });
    }
  },
  onPhoneCode: function(event) {
    var phoneNum = this.data.phoneNum;
    if (phoneNum) {
      register._getPhoneCode(phoneNum, res => {
        var code = res.code,
          desc = res.desc;
        if (code == 200) {
          this.codeCountDown();
        } else {
          this.setData({
            tip: desc,
            code: false
          });
        }
      });
    } else {
      this.setData({
        code: false,
        tip: "电话号码格式不正确"
      });
    }
  },
  codeCountDown: function() { //验证码倒计时中
    var second = this.data.second;
    if (second == 0) {
      this.setData({
        second: 60,
        disabled: false,
        getCodeText: "获取验证码"
      });
      return;
    } else {
      second--
      this.setData({
        second: second,
        disabled: true,
        getCodeText: second + '秒可重新获取'
      });

    }
    setTimeout(() => {
      this.codeCountDown();
    }, 1000);
  },
  onBindCode: function(event) { //验证手机验证码
    var phoneCode = event.detail.value,
      reg = /^\d{4}$/;
    if (phoneCode) {
      if (reg.test(phoneCode)) {
        this.setData({
          phoneCode,
          code: true
        });
      } else {
        this.setData({
          phoneCode: null,
          tip: "验证码错误,验证码是4位有效的数字",
          code: false
        });
      }
    } else {
      this.setData({
        code: true
      });
    }

  },
  onBindPassWord: function(event) { //密码验证
    var passWord = event.detail.value,
      reg = /^[a-z\d]{6,18}$/i;
    if (passWord) {
      if (reg.test(passWord)) {
        this.setData({
          passWord,
          code: true
        });
      } else {
        this.setData({
          passWord: null,
          tip: "密码必须是6-18个字符的字母或数字",
          code: false
        });
      }
    } else {
      this.setData({
        code: true
      });
    }

  },
  onBindNextStep: function(event) {
    var phoneNum = this.data.phoneNum,
      phoneCode = this.data.phoneCode,
      passWord = this.data.passWord;
    if (phoneNum && phoneCode && passWord) {
      register._codeIsRight(phoneNum, phoneCode, res => {
        var code = res.code,
          desc = res.desc;
        if (code == 200) {
          wx.navigateTo({
            url: '../perfect_page/perfect_page?phone='+phoneNum+'&passWord='+passWord
          });
        } else {
          this.setData({
            tip: desc,
            code: false
          });
        }
      });
    }
  }

})