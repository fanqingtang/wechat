import {
  School
} from "select_school_model.js";

var school = new School();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    school: [{id:null,grade:"不限"},{id:4,grade:"小学"},{id:3,grade:"初中"},{id:5,grade:"高中"}],
    provinceIndex: 0,
    cityIndex: 0,
    areaIndex: 0,
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._loadData();
  },
  _loadData: function() {
    school._selectArea((res) => {
      this.setData({
        provinceArr: res
      });
      var eObj = { //默认设置第一次加载时为北京
        detail:{
          value:3
        }
      }
      this.bindPickerProvince(eObj);
    });
  },

  bindPickerProvince: function(e) { //省选择的时候获取市的内容；
    var provinceIndex = e.detail.value;
    var provinceObj = this.data.provinceArr[provinceIndex];
    var pId = provinceObj.p_id;
    school._selectCity(pId, res => {
      var obj = {
        pc_id:null,
        pc_title:"不限"
      };
      res.unshift(obj);
      this.setData({
        cityArr: res,
        provinceIndex,
        districtArr:null,
        p_id: pId
      });
      var eObj = { //设置初始值为不限 在选择省份的时候；
        detail: {
          value: 0
        }
      };
      this.bindPickerCity(eObj);
    });

  },
  bindPickerCity: function(e) { //市
    var cityIndex = e.detail.value;
    var cityObj = this.data.cityArr[cityIndex];
    var pcId = cityObj.pc_id;
    school._selectDistrict(pcId, res => {
      var obj = {
        pct_id: null,
        pct_title: "不限"
      };
      res.unshift(obj);
      this.setData({
        districtArr: res,
        cityIndex,
        pc_id: pcId
      });
      var eObj = { //设置初始值为不限 在选择省份的时候；
        detail: {
          value: 0
        }
      };
      this.bindPickerArea(eObj);
    });
  },
  bindPickerArea(e) { //区，县
    var areaIndex = e.detail.value;
    var districtObj = this.data.districtArr[areaIndex];
    var pcTid = districtObj.pct_id;
    var pcId = this.data.pc_id;
    school._selectDistrict(pcId, res => {
      var obj = {
        pct_id: null,
        pct_title: "不限"
      };
      res.unshift(obj);
      this.setData({
        districtArr: res,
        areaIndex:areaIndex,
        pct_id:pcTid
      });
    });
  },
  bindSchoolChange:function(e){  //设置小学 初中 高中 的值；
    var grade = e.detail.value;
    var gradeObj = this.data.school[grade];
    this.setData({
        index:grade,
        gradeId:gradeObj.id
    });
  },
  onBindSearch:function(e){
    var keyWord = e.detail.value;
    this.setData({
      keyWord
    });
  },
  onSearchSchool:function(e){ //搜索学校;
    var pid = this.data.p_id;
    var pcid = this.data.pc_id;
    var pctid = this.data.pct_id;
    var xueduan = this.data.gradeId;
    var keyword = this.data.keyWord;
    var data = {
      pid,
      pcid,
      pctid,
      xueduan,
      keyword
    };
    school._searchSchool(data,res=>{
      this.setData({
        schoolNameArr: res
      });
    });
  },
  onBindSelectSchool:function(e){ //选择学校
    var schoolName = school._getTargetData(e,"name");
    var sh_id = school._getTargetData(e,"sh_id");
    wx.setStorageSync("schoolName", schoolName);
    wx.setStorageSync("sh_id", sh_id);
    wx.navigateBack({
      delta:1
    });
  }

})