import {Base} from "../../utils/base.js";

class Perfect extends Base{
  constructor(){
    super();
  }
  _onFinishRegister(data,callback){
    var url = this.baseUrl + "/api/mobile/account/register",
      data = {
        CnfApiType: "wxapp",
        CnfApiName: "register",
        use_for: "wxapp",
        role: "student",
        mobile: data.phone,
        password: data.passWord,
        name: data.name,
        sh_id:data.shId,
        sex:data.sex,
        gd_id:data.gdId,
        wxapp_openid: data.openId
      };
    var param = {
      url: url,
      data: data,
      sCallBack: function (res) {
        callback && callback(res);
      }
    }
    this.request(param);
  }
}

export {Perfect};