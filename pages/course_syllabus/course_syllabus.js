// pages/course_syllabus/course_syllabus.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var courseSyllabus = wx.getStorageSync("course_syllabus");
    this.setData({
      courseSyllabus
    })
  }
})