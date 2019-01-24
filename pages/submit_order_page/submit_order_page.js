import {
  SubmitOrder
} from "./submit_order_page_model.js";

var submitorder = new SubmitOrder(); //实例化提交订单页面

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressFlag: false, //判断区别是添加之前的部分html 还是有地址之后的HTML部分
    emptyFlag:true   //判断当断网时把总个html界面隐藏掉,当请求成功之后数据返回之后再显示出来
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中...'
    });
    this.getLocationInfo(); //弹出位置授权 
    this._loadData(options);
  },
  _loadData: function(options) { //加载页面时显示下单数据
    submitorder._getSubmitOrderList(options, res => {
      var code = res.code,
        desc = res.desc;
      if (code == 200) {
        this.setData({
          submitOrderList: res.data,
          emptyFlag:false
        });
      } else {
        submitorder._showModal('提示', desc, false);
      }
      wx.hideLoading();
    });

    // 获取地址信息
    submitorder._getAddressInfo(res => {
      var code = res.code,
        desc = res.desc;
      if (code == 200) {
        this.setData({
          addressInfo: res.data,
          addressFlag: true
        });
      } else {
        this.setData({
          addressFlag: false
        });
      }
    });

  },
  getLocationInfo: function() { //提前获取位置授权信息
    wx.authorize({
      scope: 'scope.address'
    });
  },
  onAddAdress: function(event) { //添加收货地址
    var that = this;
    wx.chooseAddress({
      success: function(res) {
        var addressInfo = {
          name: res.userName,
          phone: res.telNumber,
          province: res.provinceName,
          city: res.cityName,
          countyName: res.countyName,
          address: res.detailInfo
        };

        var adid = that.data.addressInfo ? that.data.addressInfo.adid : false; //这个adid传过去判断是否修改地址
        that.setAddressInfo(addressInfo); //设置收货地址
        //保存收货地址
        submitorder._saveAddress(res, adid, data => {
          var code = data.code,
            desc = data.desc;
          if (code != 200) {
            submitorder._showModal("提示", desc, false);
          }
        });
      },
      fail: function(err) {
        if (err.errMsg == "chooseAddress:fail:auth denied" || err.errMsg == "chooseAddress:fail auth deny") {
          submitorder._showModal("提示", "未获取到授权许可,请到'我的页面->设置->打开授权位置许可开关',获取权限!", false);
        }
      }
    });
  },
  setAddressInfo: function(addressInfo) { //设置收货地址
    this.setData({
      addressInfo,
      addressFlag: true
    });
  },
  onEditorAddress: function(event) { //编辑收货地址
    this.onAddAdress();
  },
  onbindPay: function() { //立即支付接口
    var addressFlag = this.data.addressFlag,
      od_id = this.data.submitOrderList.od_id;
    if (addressFlag) {
      submitorder._payMoney(od_id);
    } else {
      submitorder._showModal("提示", "请添加收货地址,收货地址不能为空!", false);
    }
  }


})