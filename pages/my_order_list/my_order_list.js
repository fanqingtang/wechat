import {
  MyOrderList
} from "./my_order_list_model.js";

var myOrderList = new MyOrderList(); //实例化订单类;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderTabArray: [{
      "title": "全部订单",
      "odstatus": ""
    }, {
      "title": "待支付",
      "odstatus": "dai"
    }, {
      "title": "已完成",
      "odstatus": "yi"
    }],
    tabActive: 0, //默认下划线样式添加在第一项
    searchEmptyObj: {
      text: "暂无信息列表",
      img: "/images/my_page/empty.png",
      imgClass: false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._loadData();
  },
  _loadData: function() {
    myOrderList._getOrderList(res => {
      var code = res.code,
        desc = res.desc,
        orderList = res.data;
      if (code == 200) {
        this.setData({
          orderList
        });
      } else {
        myOrderList._showModal("提示", desc, false);
      }

    });
  },
  onBindTab: function(event) { //头部tab切换
    var odstatus = myOrderList._getDataSet(event, "odstatus"),
      id = myOrderList._getDataSet(event, "id");
    myOrderList._getTabOrderList(odstatus, res => {
      var orderList = res.data;
      this.setData({
        tabActive: id,
        orderList,
        odstatus
      });
    });
  },
  onBindDetail: function(event) { //点击全部订单列表进入详情页
    var id = myOrderList._getDataSet(event, "id");
    wx.navigateTo({
      url: '../detail_page/detail_page?id=' + id
    });
  },
  onBindPay: function(event) { //立即支付
    var od_id = myOrderList._getDataSet(event, "id");
    myOrderList._payMoney(od_id);
  },
  onShow: function(event) { //取消订单成功之后刷新我的订单列表页面
    var cancelOrder = wx.getStorageSync("cancelOrder"),
      id = this.data.tabActive,
      odstatus = this.data.odstatus ? this.data.odstatus : '',
      customObj = {
        currentTarget: {
          dataset: {
            id,
            odstatus
          }
        }
      };
    if (cancelOrder) {
      this.onBindTab(customObj);
      wx.removeStorageSync("cancelOrder");
    }
  }
})