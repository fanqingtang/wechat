import {
  CourseList
} from "./course_list_page_model.js";

var courseListClass = new CourseList(); //实例化courseListClass
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseTabArray: ["公开课", "直播课", "自主课"], //tab切换课程
    scrollP: "null", //定位滚动时初始化元素的id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._loadData(options);
  },
  _loadData: function(options) {
    var type = options.type,
      grade = options.grade;
    this.courseList(grade); //课程列表
    this.setData({
      type,
      grade
    });
    setTimeout(() => { //延迟执行一进来页面滚动到定位的元素的位置，用定时器的原因时先等打开的页面DOM元素加载完毕再执行,不然执行不了。
      this.onBindCourse(type);
    }, 800);
  },
  courseList: function(grade) { //课程列表数据显示
    var auth_cookie = wx.getStorageSync("authCookie"),
      data = {
        grade,
        auth_cookie
      };
    courseListClass._courselist(data, res => {
      var gongkai = this.formatCourseList(res.gongkai),
        zhibo = this.formatCourseList(res.zhibo),
        zizhu = res.zizhu;
      this.setData({
        gongkai,
        zhibo,
        zizhu
      });
    })
  },
  formatCourseList: function(data) { //格式化首页列表时间戳
    for (var i = 0, l = data.length; i < l; i++) {
      var stime = data[i]["stime"],
        etime = data[i]["etime"],
        gongkai = data[i]["type"];
      if (gongkai == "gongkai") {
        data[i]["stime"] = courseListClass._timeStamp(stime, 1);
      } else {
        data[i]["stime"] = courseListClass._timeStamp(stime);
      }
    }
    return data;
  },
  getDetailPage: function(event) { //获得详情页数据
    var id = courseListClass._getDataSet(event, "id"),
      type = courseListClass._getDataSet(event, "type");
    wx.navigateTo({
      url: '../course_detail_page/course_detail_page?id=' + id + '&type=' + type
    });
    this.setData({
      entryFlag: false
    });
  },
  onBindCourse: function(event) { //tab点击定位到相应的位置
    var id, eleId = null;
    if (typeof event === 'object') {
      id = courseListClass._getDataSet(event, "id")
    } else {
      id = +event;
    }
    switch (id) {
      case 0:
        eleId = "gongkai";
        break;
      case 1:
        eleId = "zhibo";
        break;
      case 2:
        eleId = "zizhu";
        break;
    }
    this.setData({
      type: id,
      scrollP: eleId
    });
  },
  onShow: function(event) {
    var grade = this.data.grade;
    var publicSuccess = wx.getStorageSync("publicSuccess"); //公开课报名成功之后回到首页时刷新首页列表报名状态
    if (publicSuccess) {
      this.courseList(grade);
    }
  }
})