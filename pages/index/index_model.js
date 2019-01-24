import {
  Base
} from "../../utils/base.js";

class Index extends Base {
  constructor() {
    super();
  }
  _gradeListData(callBack) { //获取年级数据
    var url = this.baseUrl + "/api/mobile/wxapp/goods_condition",
      data = {
        CnfApiType: "wxapp",
        CnfApiName: "goods_condition",
        use_for: "wxapp"
      },
      param = {
        url,
        data,
        sCallBack:function(res){
          callBack && callBack(res.data);
        }
      }
      this.request(param);
  }

  _getBannerData(callBack) { //获取banner图
    var url = this.baseUrl + "/api/mobile/wxapp/goods_banner",
        data = {
          CnfApiType: "wxapp",
          CnfApiName: "goods_banner",
          use_for: "wxapp"
        },
        param = {
          url,
          data,
          sCallBack:function(res){
            callBack && callBack(res.data);
          }
        }
        this.request(param);
  }
  _getCourseListData(data,callBack){ //获取课程列表数据
    var url = this.baseUrl + "/api/mobile/wxapp/goods_homepagels",
        oldData = {
          CnfApiType: "wxapp",
          CnfApiName: "goods_homepagels",
          use_for: "wxapp"
        },
        newData = Object.assign(data,oldData),
        param = {
          url,
          data:newData,
          sCallBack:function(res){
            callBack && callBack(res.data);
          }
        }
        this.request(param);
  }
}

export {
  Index
};