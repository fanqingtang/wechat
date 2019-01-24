import {
  OrderDetail
} from "./detail_page_model.js";
var orderDetail = new OrderDetail();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnArray: ["取消订单", "立即支付"],
    btnActive: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._loadData(options);
  },
  _loadData: function(options) {
    var id = options.id;
    orderDetail._getOrderDetail(id, res => {
      this.setData({
        detailData: res,
        od_id: id
      });
    });
  },
  onBindPay: function(event) { //立即支付
    var od_id = this.data.od_id;
    orderDetail._payMoney(od_id);
  },
  onBindCancel: function(event) { //取消订单
    var od_id = this.data.od_id;
    orderDetail._cancelOrder(od_id, res => {
      var code = res.code,
        desc = res.desc;
      if (code == 200) {
        orderDetail._showModal("提示", "取消成功", false);
      } else {
        orderDetail._showModal("提示", desc, false);
      }
    });
  },
  onCancelOrPay: function(event) { //立即支付和取消订单
    var id = orderDetail._getDataSet(event, "id"),
      od_id = this.data.od_id;
    if (id == 1) {
      orderDetail._payMoney(od_id);
      this.setData({
        btnActive: 1
      });
    } else {
      orderDetail._cancelOrder(od_id, res => {
        var code = res.code,
          desc = res.desc;
        if (code == 200) {
          orderDetail._showModal("提示", "取消成功", false, res => {
            var errMsg = res.errMsg;
            if (errMsg == "showModal:ok") {
              wx.navigateBack({
                delta: 1
              });
              wx.setStorageSync("cancelOrder",true); //设置取消成功标识好在返回到我的订单的时候做为判断刷新页面
            }
          });
        } else {
          orderDetail._showModal("提示", desc, false);
        }
        this.setData({
          btnActive: 0
        });
      });
    }
  }
})