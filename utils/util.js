//request请求方法;
function http(url, data, callBack) {
  wx.request({
    url: url,
    data: data,
    method: "POST",
    header: {
      "content-type": "application/json"
    },
    success: function(res) {
      callBack(res);
    },
    fail: function(err) {
      console.log(err);
    }
  })
}
//便利对象方法;
function obj(obj) {
  var arr = [];
  for (var key in obj) {
    arr.push(obj[key]);
  }
  return arr;
}

function timeStamp(time, flag) { //格式化时间戳;
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
};
function getDataSet(event, key){ //获得元素上绑定的值
  return event.currentTarget.dataset[key];
};
module.exports = {
  http,
  obj,
  timeStamp,
  getDataSet
}