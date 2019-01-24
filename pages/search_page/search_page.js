var utils = require("../../utils/util.js");
var app = getApp();
var history = []; //定义一个全局的存储历史记录的数组;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    history: [],
    historyPage: false,
    courseListPage: true,
    searchEmpty: true,
    inputValue: "", //搜索框默认值
    page: 1, //默认显示的页数
    pageNum: 10, //默认每次显示的条数
    isEmpty: true, //判断newCourse对象是否为空
    newCourse: {}, //存储课程列表的数量 
    isPullDown: true, //下拉加载和搜索时为空时判断开关
    loadDataFlag: true, //下拉加载数据当数据加载完之后的标识
    searchEmptyObj: {
      text: "暂无搜索到数据",
      img: "/images/my_page/empty.png",
      imgClass: false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  onBindInput: function(event) {
    var value = event.detail.value;
    this.setData({
      inputValue: value,
      loadDataFlag: true
    });
  },
  onBindFocus: function(event) {
    var history = wx.getStorageSync("history");
    this.setData({
      historyPage: false,
      courseListPage: true,
      searchEmpty: true,
      history: history,
      loadDataFlag: true
    });
  },
  onSearchTap: function(event) { //点击搜索的时候调用onBindConfin接口;
    var value = this.data.inputValue;
    var obj = {
      detail: {
        value: value
      }
    }
    this.setData({
      isPullDown: true,
      page: 1,
      isEmpty: true,
      loadDataFlag: true
    });
    this.onBindConfin(obj);

  },
  onBindConfin: function(event) { //调用搜索接口方法  
    var type = event.type;
    if (type == 'confirm') {
      this.setData({
        page: 1,
        isEmpty: true,
        isPullDown: true,
        loadDataFlag: true
      });
    }
    var value = event.detail.value,
      url = app.globalData.lexue + "/api/mobile/wxapp/goods_sort",
      page = this.data.page,
      pageNum = this.data.pageNum,
      auth_cookie = wx.getStorageSync('authCookie'),
      data = {
        CnfApiType: "wxapp",
        CnfApiName: "goods_sort",
        use_for: "wxapp",
        keyword: value,
        auth_cookie,
        page: page,
        pagenum: pageNum
      };
    if (value) {
      utils.http(url, data, this.getSearchData);
      history.unshift(value);
      var newHistory = history.filter(function(ele, i, self) {
        return self.indexOf(ele) === i;
      });
      wx.setStorageSync("history", newHistory);
    } else {
      wx.showToast({
        title: "搜索词不能为空",
        icon: "none",
        mask: false,
        duration: 1000
      })
    }
  },
  getSearchData: function(res) { //向前端返回数据渲染;
    var data = res.data.data.course,
      page = res.data.data.page,
      isEmpty = this.data.isEmpty;
    for (var i = 0, l = data.length; i < l; i++) {
      var stime = data[i]["stime"],
        gongkai = data[i]["type"];
      if (gongkai == "gongkai") {
        data[i]["stime"] = utils.timeStamp(stime, 1);
      } else {
        data[i]["stime"] = utils.timeStamp(stime);
      }
    }
    if (isEmpty) {
      this.data.newCourse = data;
      this.data.isEmpty = false;
    } else {
      this.data.newCourse = this.data.newCourse.concat(data);
    }
    if (data.length) {
      this.setData({
        courseList: this.data.newCourse,
        historyPage: true,
        courseListPage: false,
        page: page
      });
    } else {
      if (this.data.isPullDown) {
        this.setData({
          historyPage: true,
          courseListPage: true,
          searchEmpty: false
        });
      } else {
        this.setData({
          loadDataFlag: false
        });
      }

    }

    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  onDeleteHistory: function(event) { //删除历史记录
    wx.removeStorageSync("history");
    history.length = 0;
    this.setData({
      historyPage: true
    });
  },
  onCatchJumpDetail: function(event) { //点击搜索页面跳转到相应的详情页;
    var id = event.currentTarget.dataset.id,
      type = event.currentTarget.dataset.type;
    wx.navigateTo({
      url: '../course_detail_page/course_detail_page?id=' + id + '&type=' + type
    });
  },
  onCatchHistory: function(event) { //点击历史搜索按钮的时候进行搜索;
    var target = event.target.dataset;
    if (Object.keys(target).length) {
      var historyText = target.text;
      var obj = {
        detail: {
          value: historyText
        }
      };
      this.setData({
        inputValue: historyText,
        page: 1,
        isEmpty: true,
        isPullDown: true,
        loadDataFlag: true
      });
      this.onBindConfin(obj);
    }
  },
  onBindx: function(event) { //点击x清除把输入框清空;
    var inputValue = this.data.inputValue;
    if (inputValue) {
      this.setData({
        inputValue: '',
        historyPage: false,
        courseListPage: true,
        searchEmpty: true,
        loadDataFlag: true
      });
    }
  },
  onReachBottom: function(event) { //下拉加载
    var loadDataFlag = this.data.loadDataFlag;
    if (loadDataFlag) { //初始化下拉加载标识符为true 当数据全部加载完之后为false
      wx.showNavigationBarLoading();
      var value = this.data.inputValue;
      var obj = {
        detail: {
          value: value
        }
      }
      this.data.page++;
      this.setData({
        isPullDown: false
      });
      this.onBindConfin(obj);
    }
  },
  onPullDownRefresh: function() { //上拉刷新
    var value = this.data.inputValue;
    var obj = {
      detail: {
        value: value
      }
    };
    wx.showNavigationBarLoading(); //显示加载loading动画
    this.setData({
      page: 1,
      isEmpty: true,
      loadDataFlag: true
    });
    this.onBindConfin(obj);
  },
  onShow: function(event) {
    var value = this.data.inputValue,
      obj = {
        detail: {
          value: value
        }
      };
    var publicSuccess = wx.getStorageSync("publicSuccess"); //公开课报名成功之后回到首页时刷新首页列表报名状态
    if (publicSuccess) {
      this.setData({
        page: 1,
        isEmpty: true,
        loadDataFlag: true
      });
      this.onBindConfin(obj);
    }
  }
})