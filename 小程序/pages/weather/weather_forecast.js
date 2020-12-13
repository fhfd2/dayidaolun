//调用百度地图天气API的js文件
var bmap = require('../../utils/bmap-wx-new.js');
Page({
  clock:function(){
    wx.navigateTo({
      url: '../setting/setting',
    })},
  onLoad: function (options) { 
    var that = this;
    var BMap = new bmap.BMapWX({
      //百度天气AK
      ak: 'Z3t2NpZ4RrE5IpWtctBFavhWv441YOal'
    });
    var fail = function (data) {
      console.log(data)
    }; 
    var success = function (data) {
      //获取本地位置 得到反馈天气状况
      var city = data.originalData.result.addressComponent.city;
      city = city.substring(0, city.length - 1);
      var longtitude = data.originalData.result.location.lng.toFixed(2);  
      var latitude = data.originalData.result.location.lat.toFixed(2);
      that.getWeather(city, longtitude, latitude);
      that.getAirClass(longtitude, latitude); 
    };
    BMap.regeocoding({
      fail: fail,
      success: success,
    });
  },
  getWeather: function (city, longtitude, latitude) {
      //查询今日天气
    var that = this;
    var location = longtitude + "," + latitude;
    let weatherparam = {
      location: location,
      key: 'f10d5759164d412f9dbcfc2312ea1374',
    };
    wx.request({
      //获取信息
      url: 'https://devapi.qweather.com/v7/weather/now',
      data: weatherparam,
      header: {
        "content-type": "application/json"
      },   
      success(data) {
        var currentTemp = data.data.now.temp;          
        var weatherDesc = data.data.now.text;
        var win = data.data.now.windDir;
        var humidity = data.data.now.humidity;
        var humidity = humidity + "%";
        var win_speed = data.data.now.windScale + "级";//相关变量赋值
        var advice="";
        if(currentTemp<0){advice="天气寒冷，注意运动时多加衣物，避免感冒"}
        else if(currentTemp>0&&currentTemp<10){advice="天气较冷，运动前做好热身运动"}
        else if(currentTemp>=10&&currentTemp<25){advice="天气凉爽，适宜运动"}
        else if(currentTemp>=25){advice="天气炎热，注意补水补充无机盐"}//根据气温提供建议
        //今日天气信息
        var todayInfo = {};
        todayInfo.currentTemp = currentTemp;  
        todayInfo.type = weatherDesc;
        todayInfo.wind = win + win_speed;   //构成todayInfo
        getApp().globalData.currentWeather = currentTemp;
        getApp().globalData.currentWea = weatherDesc;  
        that.getHoursForecast(longtitude, latitude);
        //得到逐小时预报
        that.setData({
          todayInfo: todayInfo,
          cityName: city,          
          celsius: "℃",
          humidity: humidity,
          displayCondition: false,
          condition:true,
          advice:advice
        }); },});},
  getAirClass: function (longtitude, latitude){
      //查询空气质量
    var that = this;
    var location = longtitude + "," + latitude;
    let weatherparam = {
      location: location,
      key: 'f10d5759164d412f9dbcfc2312ea1374',
    };
    wx.request({
      url: 'https://devapi.qweather.com/v7/air/now',
      data: weatherparam,
      success(data) {
        //判断空气质量等级
        var aqi = data.data.now.aqi;
        var airClass = data.data.now.category;     
        that.setData({
          aqi: aqi,
          airClass: airClass,
        });},});
  },
  getHoursForecast: function (longtitude, latitude) {
     //查询逐小时预报
    var that = this;
    var location = longtitude + "," + latitude;
    let weatherparam = {
      location: location,
      key: 'f10d5759164d412f9dbcfc2312ea1374',
    };
    wx.request({
      //请求地址，得到数据
      url: 'https://devapi.qweather.com/v7/weather/24h',
      data: weatherparam,
      header: {
        "content-type": "application/json"
      },
      success(data) {
        var hoursForecast = [];
        var jsonObj = {};
        jsonObj["hour"] = "现在";  
        jsonObj["tem"] = getApp().globalData.currentWeather + "℃";
        hoursForecast.push(jsonObj);
        for (var i = 0; i < data.data.hourly.length; i++) {
          var jsonObj = {};
          jsonObj["hour"] = data.data.hourly[i].fxTime.substring(11, 13) + "时";         
          jsonObj["tem"] = data.data.hourly[i].temp + "℃";
          hoursForecast.push(jsonObj);}//用得到的数据循环进行赋值
        that.setData({
          hoursForecast: hoursForecast,
        }); },});},
})