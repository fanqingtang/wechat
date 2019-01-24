var app = getApp();
class Base {
  constructor() {
    this.baseUrl = app.globalData.lexue;
    this.authCookie = wx.getStorageSync("authCookie");
  }
  request(params) {
    wx.request({
      url: params.url,
      data: params.data,
      method: "POST",
      header: {
        "content-type": "application/json"
      },
      success: function(res) {
        params.sCallBack && params.sCallBack(res.data);
      },
      fail: function(err) {
        console.log(err);
      }
    })
  }
  _timeStamp(time, flag) { //格式化时间戳;
    var date = new Date(time);
    date.setTime(date * 1000);
    var year = date.getFullYear(),
      month = date.getMonth() + 1,
      day = date.getDate(),
      hour = date.getHours(),
      min = date.getMinutes(),
      sec = date.getSeconds();
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    hour = hour < 10 ? '0' + hour : hour;
    min = min < 10 ? '0' + min : min;
    sec = sec < 10 ? '0' + sec : sec
    var newTime;
    if (flag) {
      newTime = year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
    } else {
      newTime = year + "/" + month + "/" + day;
    }
    return newTime;
  }

  _formatCourseList(data) { //格式化首页列表时间戳
    for (var i = 0, l = data.length; i < l; i++) {
      var stime = data[i]["stime"],
        etime = data[i]["etime"],
        gongkai = data[i]["type"];
      if (gongkai == "gongkai") {
        data[i]["stime"] = home._timeStamp(stime, 1);
      } else {
        data[i]["stime"] = home._timeStamp(stime);
      }
    }
    return data;
  }
  _getElePosition(ele,callBack){ //计算元素高度以及宽度
    var query = wx.createSelectorQuery();
    query.select("."+ele).boundingClientRect(rect => {
        callBack && callBack(rect);
    }).exec();
  }
  _getDataSet(event, key) { //获得元素上绑定的值
    return event.currentTarget.dataset[key];
  }
  _getTargetData(event, key) {  //获取冒泡到父元素绑定的值
    return event.target.dataset[key];
  }

  _showModal(title,content,flag,callBack){  //显示微信模态弹窗
    wx.showModal({
      title:title,
      content:content,
      showCancel:flag,
      success:function(res){
          callBack && callBack(res);
      }
    });
  }
  _payMoney(od_id) { //立即支付
    var url = this.baseUrl + "/api/mobile/wxapp/order_payment",
      openid = wx.getStorageSync("openId"),
      that = this,
      data = {
        CnfApiType: "wxapp",
        CnfApiName: "order_payment",
        use_for: "wxapp",
        od_id,
        openid
      },
      param = {
        url,
        data,
        sCallBack: function (res) {
          that._execPay(res);
        }
      };
    this.request(param);
  }
  _execPay(res) { //发起支付
    var code = res.code,
      desc = res.desc;
    if (code == 200) {
      wx.requestPayment({
        'timeStamp': res.data.data.timeStamp,
        'nonceStr': res.data.data.nonceStr,
        'package': res.data.data.package,
        'signType': 'MD5',
        'paySign': res.data.data.paySign,
        'success': function (res) {
          wx.showToast({
            title: '支付成功',
            icon: "success",
            duration: 2000
          });
          wx.navigateTo({
            url: '../report_page/report_page'
          });
        },
        'fail': function (res) {
          wx.showToast({
            title: '支付失败',
            icon: "none",
            duration: 2000
          });
        }
      });
    } else {
      this._showModal("提示", desc, false);
    }
  }
}

export {
  Base
};