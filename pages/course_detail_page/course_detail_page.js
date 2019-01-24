var app = getApp();
import {
  CourseDetailPage
} from 'course_detail_page_model.js';

var courseDetailPage = new CourseDetailPage(); //实例化详情页对象;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollEle: null, //tab切换滚动到对应的元素标签
    positions: "absolute", // 滚动到一定距离定位在头部标签
    zIndex: 0, //老师头像信息图层标签
    numIndex: 0, //课程详情里面tab开关控制
    teacherDetail: 0, //老师头像信息图层隐藏显示标签
    changeTeacherDetail: true, //点击老师头像控制头像信息图层显示隐藏标签
    ownSemester: 0, //点击切换学期控制状态标签
    versionStart: 0, //教材版本默认值
    elePosi: [], // 存储定位元素到高度值;
    loadingHide: true, //判断点击跳转页面的时候先把跳转页面隐藏掉标识
    courseKnowMargin: false //点击上课须知添加margin值标识
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._loadData(options);
  },
  getElePosition: function(ele) {
    var query = wx.createSelectorQuery();
    var that = this;
    query.select('.' + ele).boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec(function(res) {
      var h = res[0].height;
      var arr = that.data.elePosi;
      if (arr.length == 2) {
        return;
      }
      that.data.elePosi.push(h);
    });
  },

  onWatchMore: function(event) { //点击查看更多
    var courseData = this.data.courseDetailData,
      webViewAddr = courseData.h5addr;
    wx.setStorageSync("h5Address", webViewAddr);
    wx.navigateTo({
      url: '../course_more_detail/course_more_detail'
    })

  },
  scrollTopFun: function(event) { //滚动到一定高度让tab固定到头部;
    this.getElePosition("header_wrapper");
    this.getElePosition("teacher_info_wrapper");
    var elePosition = this.data.elePosi,
      scrollT = event.detail.scrollTop,
      scrollH = event.detail.scrollHeight,
      total = 0;
    elePosition.map(function(ele, i, self) {
      total += self[i];
    });
    if (scrollT >= total && scrollT < scrollH) {
      this.setData({
        positions: "fixed"
      });
    } else {
      this.setData({
        positions: "absolute",
        courseKnowMargin: false
      });
    }
  },
  onTabChange: function(event) { //tab点击的时候切换到相对应得内容;
    var target = event.target.dataset,
      type = this.data.types;

    if (Object.keys(target).length) {
      var numId = target.id;
      var eleId = "";
      if (numId == 0) {
        eleId = "tab_course_detail";
      }
      if (type == "zhibo" && numId == 1) {
        eleId = "tab_course_program"
      }
      if (type == "zizhu" && numId == 1) { //点击自主课里面的课程大纲调课程大纲webview;
        wx.navigateTo({
          url: '../course_syllabus/course_syllabus'
        })
      }
      if (numId == 2) {
        eleId = "tab_course_know";
      }
      this.setData({
        numIndex: numId,
        scrollEle: eleId,
        courseKnowMargin: true
      });
    }
  },
  bindPickerChange: function(event) { //自主课选择教材版本方法;
    var index = event.detail.value;
    var version = this.data.version; //得到版本数组;
    var versionName = version[index]; //得到对应得版本;
    var versionObj = this.data.versionObj; //得到数组版本对象
    var bvid = this.findVersionId(versionObj, versionName); //得到版本对应的id;
    var gid = this.data.courseDetailData.gid; //课程id;
    var cgid = this.data.cgid; //学期id
    var webView = this.data.website + "mk.php?do=ginfor&gs_id=" + gid + "&bv_id=" + bvid + "&type=course_mobile_index&cgi_id=" + cgid;
    this.setData({
      versionStart: index,
      bvid: bvid
    });
    wx.setStorageSync("course_syllabus", webView);
  },
  findVersionId: function(obj, value) {
    var id;
    for (var i = 0, l = obj.length; i < l; i++) {
      if (obj[i].bvname == value) {
        id = obj[i].bvid;
      }
    }
    return id;
  },
  onSemesterTap: function(event) { //自主课选择学期切换;
    var id = courseDetailPage._getDataSet(event, "id"),
      index = courseDetailPage._getDataSet(event, "index"),
      gid = this.data.courseDetailData.gid,
      data = {
        gid,
        id
      };
    courseDetailPage._selectSemester(data, res => { //学期切换调用方法;
      this.setData({
        ownSemester: index,
        cgid: id,
        webview: res.webview,
        version: res.version,
        coursePrice: res.coursePrice,
        versionObj: res.versionObj,
        versionStart: res.versionStart,
        duration: res.duration
      });
      wx.setStorageSync("course_syllabus", res.webview);
    });
  },
  onShowTeacherDetail: function(event) { //点击头像的时候显示老师简介信息;
    var changeFlag = this.data.changeTeacherDetail,
      teacherId = this.data.courseDetailData.teaid;
    if (changeFlag) {
      this.setData({
        teacherDetail: 1,
        changeTeacherDetail: false,
        zIndex: 5
      });
      courseDetailPage._getHeaderInfo(teacherId, res => { //设置老师头像信息
        this.setData({
          teacherImgInfo: res.teacherimg
        });
      });
    } else {
      this.setData({
        teacherDetail: 0,
        changeTeacherDetail: true,
        zIndex: 0
      });
    }
  },
  onHideTeacherDetail: function(event) { //点击头像里面收起的时候隐藏老师简介信息
    this.setData({
      teacherDetail: 0,
      changeTeacherDetail: true,
      zIndex: 0
    })
  },
  onReportTap: function(event) { //立即报名方法
    var courseType = this.data.types,
      courseTypeId = this.data.id,
      gsid = this.data.courseDetailData.cgid,
      gid = this.data.courseDetailData.gid,
      price = this.data.coursePrice,
      autoGsid = this.data.cgid,
      bvid = this.data.bvid,
      autoCookie = wx.getStorageSync("authCookie"),
      options = this.data.options,
      that = this;
    if (autoCookie) {
      switch (courseType) {
        case "zhibo":
          wx.navigateTo({
            url: '../submit_order_page/submit_order_page?price=' + price + '&gsid=' + gid + '&cgid=' + gsid + '&courseType=' + courseType
          });
          break;
        case "zizhu":
          wx.navigateTo({
            url: '../submit_order_page/submit_order_page?price=' + price + '&gsid=' + gid + '&cgid=' + autoGsid + '&bvid=' + bvid + '&courseType=' + courseType
          });
          break;
        case "gongkai":
          courseDetailPage._publicReport(courseTypeId, res => {
            var code = res.code,
              desc = res.desc;
            if (code == 200) {
              wx.navigateTo({
                url: '../report_page/report_page'
              });
              that._loadData(options); //刷新公开课详情页报名成功之后报名按钮的状态
              wx.setStorageSync("publicSuccess", true);  //报名成功之后回到首页时刷新首页列表报名状态的标识

            } else {
              courseDetailPage._showModal('提示', desc, false); //微信模态弹窗
            }
          });

      }
    } else {
      wx.navigateTo({
        url: '../get_phone_number/get_phone_number?id=' + courseTypeId + '&type=' + courseType
      });
    }


  },
  _loadData: function(options) { //加载数据
    wx.showLoading({
      title: '加载中...'
    });
    var courseId = options.id,
      courseType = options.type;
    this.setData({
      types: courseType,
      id: courseId,
      options
    });
    courseDetailPage._noSameCourse(options, (res, flag) => {
      if (flag) {
        this.setData({
          courseDetailData: res.newData,
          coursePrice: res.coursePrice,
          duration: res.duration,
          semester: res.semester,
          ownCourseData: res.ownCourseData,
          versionObj: res.versionObj,
          version: res.version,
          bvid: res.bvid,
          cgid: res.cgid,
          website: res.website,
          loadingHide: false
        });
        wx.setStorageSync("course_syllabus", res.ownCourseData.webview);
        wx.hideLoading();
      } else {
        this.setData({
          courseDetailData: res.newData,
          courseTable: res.courseTableData,
          coursePrice: res.coursePrice,
          loadingHide: false
        });
        wx.hideLoading();
      }

    });
  },

  onShow: function(event) { //注册成功之后再调一次获取authCookie方法；
    var registerSuccess = wx.getStorageSync("registerSuccess");
    if (registerSuccess == "注册成功") {
      app.loginFn().then(res => {
        var sessionKey = res.session_key,
          openId = res.openid,
          authCookie = res.auth_cookie;
        wx.setStorageSync("session_key", sessionKey);
        wx.setStorageSync("openId", openId);
        if (authCookie) {
          wx.setStorageSync("authCookie", authCookie);
        }
        wx.showToast({
          title: "注册成功",
          icon: 'success',
          duration: 2000
        });
        wx.removeStorageSync('registerSuccess');
      });
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var type = this.data.types,
      id = this.data.id;
    return {
      title: "乐学一百",
      path: 'pages/course_detail_page/course_detail_page?id=' + id + '&type=' + type
    }
  }
})