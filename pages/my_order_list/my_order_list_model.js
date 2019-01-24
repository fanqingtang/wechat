import {
  Base
} from "../../utils/base.js";

class MyOrderList extends Base {
  constructor() {
    super();
  }

  _getOrderList(callBack) { //获取订单列表;
    var auth_cookie = wx.getStorageSync("authCookie"),
      url = this.baseUrl + "/api/mobile/wxapp/order_list",
      data = {
        CnfApiType: "wxapp",
        CnfApiName: "order_list",
        use_for: "wxapp",
        auth_cookie
      },
      param = {
        url,
        data,
        sCallBack: function(res) {
          callBack && callBack(res)
        }
      };
    this.request(param);
  }
  _getTabOrderList(odstatus, callBack) { //获取tab切换时不同的课程订单列表
    var auth_cookie = wx.getStorageSync("authCookie"),
      url = this.baseUrl + "/api/mobile/wxapp/order_list",
      data = {
        CnfApiType: "wxapp",
        CnfApiName: "order_list",
        use_for: "wxapp",
        auth_cookie,
        odstatus
      },
      param = {
        url,
        data,
        sCallBack: function(res) {
          var code = res.code;
          if (code == 200) {
            callBack && callBack(res);
          } else {
            console.log(res.desc);
          }
        }
      };
    this.request(param);
  }
}


export {
  MyOrderList
};