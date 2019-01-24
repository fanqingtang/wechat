import {
  Base
} from "../../utils/base.js";

class OrderDetail extends Base {
  constructor() {
    super();
  }

  _getOrderDetail(id,callBack) { //获取到课程订单列表详情页信息
    var url = this.baseUrl + "/api/mobile/wxapp/order_infor",
      orderid = id,
      data = {
        CnfApiType: "wxapp",
        CnfApiName: "order_infor",
        use_for: "wxapp",
        orderid: id
      },
      param = {
        url,
        data,
        sCallBack:function(res){
          callBack && callBack(res);
        }
      };
      this.request(param);
  }
  _cancelOrder(od_id,callBack){ //取消订单列表
    var url = this.baseUrl + "/api/mobile/wxapp/order_cancelorder",
      data = {
        CnfApiType: "wxapp",
        CnfApiName: "order_cancelorder",
        use_for: "wxapp",
        od_id
      },
      param = {
        url,
        data,
        sCallBack: function (res) {
          callBack && callBack(res);
        }
      };
    this.request(param);
  }
}

export {
  OrderDetail
}