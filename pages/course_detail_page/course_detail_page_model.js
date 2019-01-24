import {
  Base
} from '../../utils/base.js';

class CourseDetailPage extends Base {
  constructor() {
    super();
  }
  //显示不同课程详情
  _noSameCourse(options, callback) {
    var courseId = options.id,
      courseType = options.type;
    switch (courseType) {
      case "zhibo":
        this._directDetail(courseId, callback); //直播课返回的数据；
        break;
      case "gongkai":
        this._publicDetail(courseId, callback); //公开课返回的数据；
        break;
      case "zizhu":
        this._ownDetail(courseId, callback);  //自主课返回的数据；
        break;
    }
  }
  _directDetail(id, callback) { //直播课详情页数据；
    var url = this.baseUrl + "/api/mobile/wxapp/goods_zhiboinfor",
      data = {
        CnfApiType: "wxapp",
        CnfApiName: "goods_zhiboinfor",
        use_for: "wxapp",
        goodid: id
      },
      that = this;
    var param = {
      url: url,
      data: data,
      sCallBack: function(data) {
        //把时间戳格式化成时间    
        var sTime = data.stime,
          eTime = data.etime,
          coursePrice = data.price, //课程价钱
          courseTable = data.classcard;
        data.stime = that._timeStamp(sTime);
        data.etime = that._timeStamp(eTime);
        var courseTableData = that._formatTime(courseTable);
        var newData = {
          bmnum: data.bmnum,
          etime: data.etime,
          gsnum: data.gsnum,
          h5addr: data.h5addr,
          stime: data.stime,
          teaimg: data.teaimg,
          teaname: data.teaname,
          title: data.title,
          teaid: data.teaid,
          cgid: data.cgid,
          gid: data.gid
        }
        var allData = {
          newData,
          coursePrice,
          courseTableData
        }
        callback && callback(allData);
      }
    };
    this.request(param);
  }
  _publicDetail(id, callback) { //公开课详情页数据；
    var url = this.baseUrl + "/api/mobile/wxapp/goods_gongkaiinfor",
      auth_cookie = wx.getStorageSync("authCookie"),
      data = {
        CnfApiType: "wxapp",
        CnfApiName: "goods_gongkaiinfor",
        use_for: "wxapp",
        gongkaiid: id,
        auth_cookie
      };
    var param = {
      url: url,
      data: data,
      sCallBack: function(res) {
        var newData = res.data,
          coursePrice = 0,
          courseTableData = null
        var allData = {
          newData,
          coursePrice,
          courseTableData
        }
        callback && callback(allData);
      }
    }
    this.request(param);
  }
  _ownDetail(id, callback) { //自主课详情页数据；
    var url = this.baseUrl + "/api/mobile/wxapp/goods_zizhuinfor",
      data = {
        CnfApiType: "wxapp",
        CnfApiName: "goods_zizhuinfor",
        use_for: "wxapp",
        zizhuid: id
      },
      that = this;
    var param = {
      url: url,
      data: data,
      sCallBack: function(res) {
        var code = res.code,
          desc = res.desc;
        if (code == 200) {
          var semester = res.data.guige,
            webView = res.data.webview,
            website = res.data.website,
            cgid = semester[0].cgid,
            bvid = res.data.version[0].bvid,
            coursePrice = res.data.price,
            duration = res.data.duration,
            gid = res.data.gid,
            newData = {
              gid,
              h5addr: res.data.h5addr,
              title: res.data.title,
            },
            changePart = {
              price: res.data.price,
              webview: webView
            },
            versionObj = res.data.version;
          var version = that._arrayObj(versionObj);
          var allData = {
            newData,
            coursePrice,
            duration,
            semester,
            ownCourseData: changePart,
            versionObj,
            version,
            bvid: bvid,
            cgid,
            website
          }
          callback && callback(allData, 1);
        }


      }
    }
    this.request(param);
  }
  _formatTime(courseData) { //格式化课程大纲里面的时间
    var courseTable = courseData;
    for (var i = 0, l = courseTable.length; i < l; i++) {
      var sTime = courseTable[i].lt_stime;
      courseTable[i].lt_stime = this._timeStamp(sTime, 1);
      courseTable[i].lt_etime = this._tableState(sTime);
    }
    return courseTable;
  }
  _arrayObj(obj) { //数组对象转成数组
    var version = [];
    obj.map(function(ele, i, self) {
      version.push(self[i].bvname);
    });
    return version;
  }

  _tableState(etime) { //判断课程大纲里面的状态是已结束还是未开始;
    var nowTime = new Date().getTime();
    var endTime = etime * 1000;
    if (nowTime - endTime > 0) {
      return 1 // 1表示已结束;
    } else {
      return 2 //表示未开始;
    }
  }
  _getHeaderInfo(id, callback) { //获取老师头像信息
    var url = this.baseUrl + "/api/mobile/wxapp/goods_tchintroimg",
      data = {
        CnfApiType: "wxapp",
        CnfApiName: "goods_tchintroimg",
        use_for: "wxapp",
        teacherid: id
      };
    var param = {
      url: url,
      data: data,
      sCallBack: function(res) {
        callback && callback(res);
      }
    }
    this.request(param);
  }
  _selectSemester(data, callback) {
    var url = this.baseUrl + "/api/mobile/wxapp/goods_guigeinfor",
      data = {
        CnfApiType: "wxapp",
        CnfApiName: "goods_guigeinfor",
        use_for: "wxapp",
        guigeid: data.id,
        zizhuid: data.gid
      },
      that = this;
    var param = {
      url: url,
      data: data,
      sCallBack: function(res) {
        var versionObj = res.data.version;
        var version = that._arrayObj(versionObj);
        var allData = {
          webview: res.data.webview,
          duration: res.data.duration,
          version,
          versionObj,
          coursePrice: res.data.price,
          versionStart: 0
        }
        callback && callback(allData);
      }
    }
    this.request(param);
  }

  _publicReport(courseId, callBack) { //公开课报名
    var url = this.baseUrl + "/api/mobile/wxapp/order_gongkaibm",
      auth_cookie = wx.getStorageSync("authCookie"),
      data = {
        CnfApiType: "wxapp",
        CnfApiName: "order_gongkaibm",
        use_for: "wxapp",
        auth_cookie,
        gongkaiid: courseId
      };
    var param = {
      url: url,
      data: data,
      sCallBack: function(res) {
        callBack && callBack(res);
      }
    }
    this.request(param);
  }
  _directPay(newData, callBack) { //直播课支付
    var openid = wx.getStorageSync("openId"),
      url = this.baseUrl + "/api/mobile/wxapp/order_add",
      data = {
        CnfApiType: "wxapp",
        CnfApiName: "order_add",
        use_for: "wxapp",
        auth_cookie: newData.autoCookie,
        gsid: newData.gid,
        cgid: newData.gsid,
        price: newData.price
      };
    // if (flag == 2) {
    //   data = {
    //     CnfApiType: "wxapp",
    //     CnfApiName: "order_add",
    //     use_for: "wxapp",
    //     auth_cookie: newData.autoCookie,
    //     gsid: newData.gid,
    //     cgid: newData.autoGsid,
    //     price: newData.price,
    //     bvid: newData.bvid,
    //     openid: openid
    //   }
    // }
    var param = {
      url: url,
      data: data,
      sCallBack: function(res) {
        // console.log(res);
        callBack && callBack(res, 1); //默认传1是直播课
      }
    };
    this.request(param);
  }
  _execPay(res) { //发起支付
    console.log(res);
    var code = res.code,
      desc = res.desc;
    if (code == 200) {
      var result = res.data.result.data,
        appId = result.appId,
        nonceStr = result.nonceStr,
        _package = result.package,
        paySign = result.paySign,
        timeStamp = result.timeStamp;
      wx.requestPayment({
        'timeStamp': timeStamp,
        'nonceStr': nonceStr,
        'package': _package,
        'signType': 'MD5',
        'paySign': paySign,
        'success': function(res) {
          wx.showToast({
            title: '支付成功',
            icon: "success",
            duration: 2000
          });
          wx.navigateTo({
            url: '../report_page/report_page'
          });
        },
        'fail': function(res) {
          wx.showToast({
            title: '支付失败',
            icon: "none",
            duration: 2000
          });
        }
      });
    } else {
      wx.showModal({
        title: '提示',
        content: desc
      });
    }
  }
}

export {
  CourseDetailPage
};