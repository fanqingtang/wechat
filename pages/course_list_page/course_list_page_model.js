import {Base} from "../../utils/base.js";


class CourseList extends Base{
  constructor(){
    super();
  }
  _courselist(data,callBack){  //公开课/直播课/自主课 课程列表数据
    var url = this.baseUrl + "/api/mobile/wxapp/goods_coursebytype",
      oldData = {
        CnfApiType: "wxapp",
        CnfApiName: "goods_coursebytype",
        use_for: "wxapp"
      },
      newData = Object.assign(data,oldData),
     param = {
       url,
       data:newData,
       sCallBack:function(res){
          callBack && callBack(res.data);
       }
     };
     this.request(param);
  }

}

export {CourseList};