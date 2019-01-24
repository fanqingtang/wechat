import {
  Base
} from "../../utils/base.js";

class MyPage extends Base {
  constructor() {
    super();
  }
  _getUserInfo(callBack) { //获取用户信息
    var url = this.baseUrl + "/api/mobile/wxapp/user_infor",
      auth_cookie = wx.getStorageSync("authCookie"),
      data = {
        CnfApiType: "wxapp",
        CnfApiName: "user_infor",
        use_for: "wxapp",
        auth_cookie
      },
      param = {
        url,
        data,
        sCallBack: function(res) {
          callBack && callBack(res.data);
        }
      };
    this.request(param);
  }
  _changeUser(callBack) {
    var url = this.baseUrl + "/api/mobile/wxapp/user_untie",
      auth_cookie = wx.getStorageSync("authCookie"),
      data = {
        CnfApiType: "wxapp",
        CnfApiName: "user_untie",
        use_for: "wxapp",
        auth_cookie
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
}

export {
  MyPage
};