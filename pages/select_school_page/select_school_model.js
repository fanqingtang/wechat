import {
  Base
} from "../../utils/base.js";

class School extends Base {
  constructor() {
    super();
  }

  _selectArea(callback) { //省份接口
    var url = this.baseUrl + "/api/mobile/wxapp/user_province",
      data = {
        CnfApiType: "wxapp",
        CnfApiName: "user_province",
        use_for: "wxapp"
      };
    var param = {
      url: url,
      data: data,
      sCallBack: function(res) {
        var data = res.data;
        callback && callback(data);
      }
    }
    this.request(param);
  }
  _selectCity(pId, callback) { //市接口
    var url = this.baseUrl + "/api/mobile/wxapp/user_city",
      data = {
        CnfApiType: "wxapp",
        CnfApiName: "user_city",
        use_for: "wxapp",
        pid: pId
      };
    var param = {
      url: url,
      data: data,
      sCallBack: function(res) {
        var data = res.data;
        callback && callback(data);
      }
    }
    this.request(param);
  }
  _selectDistrict(pcId, callback) { //区，县接口
    var url = this.baseUrl + "/api/mobile/wxapp/user_county",
      data = {
        CnfApiType: "wxapp",
        CnfApiName: "user_county",
        use_for: "wxapp",
        pcid: pcId
      };
    var param = {
      url: url,
      data: data,
      sCallBack: function(res) {
        var data = res.data;
        callback && callback(data);
      }
    }
    this.request(param);
  }
  _searchSchool(data,callback){
    var url = this.baseUrl + "/api/mobile/wxapp/user_school",
      data = {
        CnfApiType: "wxapp",
        CnfApiName: "user_school",
        use_for: "wxapp",
        pid:data.pid,
        pcid: data.pcid,
        pctid:data.pctid,
        xueduan:data.xueduan,
        keyword:data.keyword
      };
    var param = {
      url: url,
      data: data,
      sCallBack: function (res) {
        var data = res.data;
        callback && callback(data);
      }
    }
    this.request(param);
  }
}


export {
  School
};