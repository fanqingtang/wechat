import {
  Perfect
} from "perfect_page_model.js";

var perfect = new Perfect();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    grade: ["请选择", "一年级", "二年级", "三年级", "四年级", "五年级", "六年级", "七年级", "八年级", "九年级"],
    index: 0,
    sex: ["保密", "男", "女"],
    sexIndex: 0,
    schoolName: "请选择",
    tipTitle: "请输入2-5位中文",
    tipFlag: true,
    name: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._loadData(options);
  },
  _loadData: function(options) {
    var phone = options.phone,
      passWord = options.passWord;
    this.setData({
      phone,
      passWord
    });
  },
  bindChangeGrade: function(e) {
    this.setData({
      index: e.detail.value
    });
  },
  onBindSelectSchool: function(event) {
    wx.navigateTo({
      url: '../select_school_page/select_school_page'
    })
  },
  onBindSelectSex: function(event) { //性别切换
    var index = perfect._getDataSet(event, "id");
    this.setData({
      sexIndex: index
    });
  },
  onBindName: function(event) {
    var name = event.detail.value;
    var reg = /^[\u4e00-\u9fa5]{2,5}$/;
    if (name) {
      if (reg.test(name)) {
        this.setData({
          tipFlag: true,
          name
        });
      } else {
        this.setData({
          tipFlag: false,
          tipTitle:"请输入2-5位中文",
          name: null
        });
      }
    } else {
      this.setData({
        tipFlag: true
      });
    }


  },
  onShow: function() { //显示选择的学校
    var schoolName = wx.getStorageSync("schoolName");
    var sh_id = wx.getStorageSync("sh_id");
    if(schoolName){
      this.setData({
        schoolName,
        sh_id
      });
    }
  },
  onBindRegister: function(event) { //完成注册
    var phone = this.data.phone,
      passWord = this.data.passWord,
      name = this.data.name,
      sex = this.data.sexIndex,
      shId = this.data.sh_id,
      gdId = this.data.index,
      openId = wx.getStorageSync("openId");
    var data = {
      phone,
      passWord,
      name,
      sex,
      shId,
      gdId,
      openId
    };
    if (name && shId) {
      perfect._onFinishRegister(data,res=>{
        var desc = res.desc,
            code = res.code;
            if(code == 200){
              wx.setStorageSync("registerSuccess", "注册成功");
              wx.navigateBack({
                delta:4
              });
            }else{
              wx.showToast({
                title: desc,
                icon:'none',
                duration:2000
              });
            }
      });
    }else{
      this.setData({
        tipFlag: false,
        tipTitle:"请选择学校或填写真实姓名"
      });
    }
  }
})