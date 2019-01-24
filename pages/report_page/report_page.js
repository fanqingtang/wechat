// pages/report_page/report_page.js
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
  
  },
  courseDetail:function(event){
    wx.navigateBack({
      delta:1
    })
  }
})