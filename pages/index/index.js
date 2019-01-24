import {
  Index
} from "index_model.js";
var home = new Index();

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    grade: "七年级", //默认显示七年级
    arrow: "/images/index/down_arrow.png",
    gradeActive: 7, //年级选中样式标识
    subject: 0, // 精选/数学/英语标识
    page: 1, //默认显示第一页
    pagenum: 6, //每页返回6条数据
    maskFlag: true, //显示年级下拉列表遮罩层显示标识
    subjectArray: ["精选", "数学", "英语"], //科目类型
    courseListArray: [], //存放所有课的数组
    courseEmpty: true, //下拉加载更多是判断请求的数据是否为空，当返回的数据为空时,不再发送请求。
    loadingHide:true //判断当在断网的情况下或者没有数据的情况下让HTML界面隐藏掉，当数据加载过来时再让HTML显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._loadData();

    
  },


  _loadData() {
    wx.showLoading({
      title: '加载中...'
    });
    this.gradeList();
    this.getBannerImg();
    this.courseList();
  },
  gradeList: function() { //筛选数据调用方法;
    home._gradeListData(res => {
      var all = res.all[0],
        middleKey = Object.keys(res.middle),
        middleValue = Object.values(res.middle),
        primaryKey = Object.keys(res.primary),
        primaryValue = Object.values(res.primary);
      this.setData({
        allGrade: all,
        middleValue,
        middleKey,
        primaryValue,
        primaryKey
      });

    });
  },

  onBindMiddle: function(event) { //初中/小学年级选择
    var id = home._getTargetData(event, "id"),
      middleValue = this.data.middleValue,
      primaryValue = this.data.primaryValue,
      allGrade = this.data.allGrade,
      mergeValue = primaryValue.concat(middleValue, allGrade);
    this.setData({
      gradeActive: id,
      maskFlag: true,
      grade: mergeValue[id - 1],
      arrow: "/images/index/down_arrow.png",
      page: 1,
      courseEmpty: true,
      courseListArray: []
    });
    this.courseList();

  },
  getBannerImg: function() { //调用获取banner图接口;
    home._getBannerData(res => {
      var dataImg = res.length ? res : [{
        "img": "/images/index/banner.png",
        "link": "defaultImg"
      }];
      this.setData({
        swiper_map: dataImg
      });
    });
  },
  onImgDetail: function(event) { //默认一张banner图片跳转详情页
    var imgDetail = home._getDataSet(event, "link");
    if (imgDetail == "defaultImg") {
      wx.navigateTo({
        url: '../banner_detail/banner_detail'
      });
    }
  },
  courseList: function() { //课程列表数据显示
    var grade = this.data.gradeActive,
      subject = this.data.subject,
      page = this.data.page,
      pagenum = this.data.pagenum,
      auth_cookie = wx.getStorageSync("authCookie");
    grade = grade == 10 ? 100 : grade; //判断是六年级五四制时传100
    grade = grade == 11 ? 0 : grade; //判断是所有年级时传0
    var data = {
      grade,
      subject,
      page,
      pagenum,
      auth_cookie
    };
    home._getCourseListData(data, res => {
      var courseArray = res.course,
        courseList = this.formatCourseList(courseArray),
        courseListArray = this.data.courseListArray.concat(courseList);
      if (courseArray.length < pagenum) {
        this.setData({
          courseListArray,
          courseEmpty: false,
          loadingHide:false
        });
      } else {
        this.setData({
          courseListArray,
          courseArray,
          loadingHide:false
        });
      }

      wx.hideLoading();
    });
  },

  onBindSubject: function(event) { //选择精选、数学、英语时的方法；
    var id = home._getTargetData(event, "id");
    this.setData({
      subject: id,
      page: 1,
      courseListArray: [],
      courseEmpty: true
    });
    this.courseList();
  },
  formatCourseList: function(data) { //格式化首页列表时间戳
    for (var i = 0, l = data.length; i < l; i++) {
      var stime = data[i]["stime"],
        etime = data[i]["etime"],
        gongkai = data[i]["type"];
      if (gongkai == "gongkai") {
        data[i]["stime"] = home._timeStamp(stime, 1);
      } else {
        data[i]["stime"] = home._timeStamp(stime);
      }
    }
    return data;
  },
  searchPage: function(event) {
    wx.navigateTo({
      url: '../search_page/search_page'
    });
  },
  selectGrade: function(event) {
    var maskFlag = this.data.maskFlag;
    if (maskFlag) {
      this.setData({
        maskFlag: false,
        arrow: "/images/index/up_arrow.png"
      })
      maskFlag = !maskFlag;
    } else {
      this.setData({
        maskFlag: true,
        arrow: "/images/index/down_arrow.png"
      })
      maskFlag = !maskFlag;
    }

  },
  preventScroll: function(event) { //防止遮罩层滚动;
    return false;
  },
  onHideGrade: function(event) { //选择年级的时候出现遮罩层;
    this.setData({
      maskFlag: true,
      arrow: "/images/index/down_arrow.png"
    })
  },


  getDetailPage: function(event) { //获得详情页信息;
    var id = home._getDataSet(event, "id"),
      type = home._getDataSet(event, "type");
    wx.navigateTo({
      url: '../course_detail_page/course_detail_page?id=' + id + '&type=' + type
    });
  },
  onReachBottom: function(event) { //下拉加载
    var page = ++this.data.page,
      courseEmpty = this.data.courseEmpty;
    this.setData({
      page
    });
    if (courseEmpty) {
      this.courseList();
    }
  },
  onPullDownRefresh: function() { //上拉刷新
    this.setData({
      page: 1,
      courseListArray: [],
      courseEmpty: true
    });
    this.courseList();
    this.getBannerImg();
    wx.stopPullDownRefresh(); //停止当前页面下拉刷新
  },
  onShow: function(event) {
    var loginSuccess = wx.getStorageSync("loginSuccess"); //获取点击登入成功的时候设置的loginSuccess为true,如果为true说明登入成功，刷新首页。
    var publicSuccess = wx.getStorageSync("publicSuccess"); //公开课报名成功之后回到首页时刷新首页列表报名状态
    if (loginSuccess || publicSuccess) {
      this.onPullDownRefresh(); //切换用户之后刷新页面
      wx.removeStorageSync("loginSuccess"); //刷新完首页列表之后清除设置的缓存标识
      wx.removeStorageSync("publicSuccess");
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    return {
      title: "乐学一百",
      path: "pages/index/index",
      imageUrl: "/images/index/forward.png"
    }
  }
})