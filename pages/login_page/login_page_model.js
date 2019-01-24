import {
  Base
} from '../../utils/base.js';

class Login extends Base {
  constructor(){
    super();
  }
  _login(data,callback){ //登入
    var url = this.baseUrl + "/api/mobile/account/login",
      data = {
        CnfApiType: "wxapp",
        CnfApiName: "login",
        use_for: "wxapp",
        role:"student",
        username: data.username,
        password: data.passWord,
        wxapp_openid: data.openId
      };
      var param = {
        url:url,
        data:data,
        sCallBack:function(res){
           callback && callback(res);
        }
      }
      this.request(param);
  }
}

export {Login};