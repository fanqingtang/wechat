import {
  Base
} from "../../utils/base.js";

class SubmitOrder extends Base {
  constructor() {
    super();
  }

  _getSubmitOrderList(options, callBack) { //获取提交订单列表信息
    var courseType = options.courseType,
      url = this.baseUrl + "/api/mobile/wxapp/order_add",
      auth_cookie = wx.getStorageSync("authCookie"),
      data = {
        CnfApiType: "wxapp",
        CnfApiName: "order_add",
        use_for: "wxapp",
        auth_cookie
      },
      newData = null;
    if (courseType == "zhibo") {
      newData = Object.assign(data, options);
    } else {
      newData = Object.assign(data, options);
    }
    delete newData["courseType"];
    var param = {
      url,
      data: newData,
      sCallBack(res) {
        callBack && callBack(res);
      }
    };
    this.request(param);
  }

  _saveAddress(res, adid, callBack) { //保存收货地址
    var url = this.baseUrl + "/api/mobile/wxapp/user_addAddress",
      auth_cookie = wx.getStorageSync("authCookie"),
      data = null;

    if (adid) {
      data = {
        CnfApiType: "wxapp",
        CnfApiName: "user_addAddress",
        use_for: "wxapp",
        auth_cookie,
        name: res.userName,
        phone: res.telNumber,
        province: res.provinceName,
        city: res.cityName,
        area: res.countyName,
        address: res.detailInfo,
        adid: adid
      }
    } else {
      data = {
        CnfApiType: "wxapp",
        CnfApiName: "user_addAddress",
        use_for: "wxapp",
        auth_cookie,
        name: res.userName,
        phone: res.telNumber,
        province: res.provinceName,
        city: res.cityName,
        area: res.countyName,
        address: res.detailInfo,
      }
    }
    var param = {
      url,
      data,
      sCallBack: function(res) {
        callBack && callBack(res);
      }
    };
    this.request(param);
  }

  _getAddressInfo(callBack) { //获取收货地址
    var url = this.baseUrl + "/api/mobile/wxapp/user_getAddress",
      auth_cookie = wx.getStorageSync("authCookie"),
      data = {
        CnfApiType: "wxapp",
        CnfApiName: "user_getAddress",
        use_for: "wxapp",
        auth_cookie
      },
      param = {
        url,
        data,
        sCallBack: function(res) {
          callBack && callBack(res);
        }
      };
    this.request(param);
  }
}


export {
  SubmitOrder
};