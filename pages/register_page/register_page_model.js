import {Base} from "../../utils/base.js";
class Register extends Base{
    constructor(){
      super();
    }

    _getPhoneCode(phoneNum,callback){ //获取验证的方法
      var url = this.baseUrl + "/api/mobile/account/reg_getcode",
        data = {
          CnfApiType: "wxapp",
          CnfApiName: "reg_getcode",
          use_for: "wxapp",
          role:"student",
          mobile: phoneNum
        };
        var param = {
          url:url,
          data:data,
          sCallBack:function(res){
            callback && callback(res);
          }
        };

        this.request(param);
    
    }

    _codeIsRight(phoneNum,phoneCode,callback){
      var url = this.baseUrl + "/api/mobile/account/reg_checkcode",
        data = {
          CnfApiType: "wxapp",
          CnfApiName: "reg_checkcode",
          use_for: "wxapp",
          mobile: phoneNum,
          code:phoneCode
        };
      var param = {
        url: url,
        data: data,
        sCallBack: function (res) {
          callback && callback(res);
        }
      };
      this.request(param);
    }
}


export{Register};