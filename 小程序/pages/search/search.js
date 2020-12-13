// pages/search/search.js
Page({
  data: {
    checked_value: "",
    tem: [
      {
        value: "低于0摄氏度",
        checked: false
      },
      {
        value: "0~10摄氏度",
        checked: false
      },
      {
        value: "10~25摄氏度",
        checked: false
      },
      {
        value: "高于25摄氏度",
        checked: false
      },
      //温度变量定义
    ],
    checked_value1: "",
    uv: [
      {
        value: "0~2",
        checked: false
      },
      {
        value: "3~4",
        checked: false
      },
      {
        value: "5~6",
        checked: false
      },
      {
        value: "7~9",
        checked: false
      },
      {
        value: ">10",
        checked: false
      },
    ],//紫外线变量定义
  },
  change: function(e){
    //紫外线标签设置
    let items = this.data.uv;
    console.log(e.detail)
    for(let i=0;i<items.length;i++){
      items[i].checked = items[i].value === e.detail.value
    }
    var advice1='';//紫外线建议if语句
if(e.detail.value=='0~2'){advice1="最弱 安全 可以不采取措施"}
else if(e.detail.value=='3~4'){advice1="弱 正常 外出戴防护帽或太阳镜"}
else if(e.detail.value=='5~6'){advice1="中等 注意 除戴防护帽和太阳镜外，涂擦防晒霜(防晒霜SPF指数应不低于15)"}
else if(e.detail.value=='7~9'){advice1="强 较强 在上午十点至下午四点时段避免外出活动，外出时应尽可能在遮荫处,涂擦防晒霜(防晒霜SPF指数应不低于20)"}
else if(e.detail.value=='>10'){advice1="很强 有害 尽量不外出，必须外出时，要采取一定的防护措施 "}
    this.setData({
      uv: items,
      checked_value1: e.detail.value,
      advice1:advice1
    })
  },
  change2: function(e){
  //温度标签
    let items = this.data.tem;
    console.log(e.detail)
    for(let i=0;i<items.length;i++){
      items[i].checked = items[i].value === e.detail.value
    }
    var advice=''//温度建议语句
if(e.detail.value=='低于0摄氏度'){advice="天气寒冷，注意运动时多加衣物，避免感冒"}
else if(e.detail.value=='0~10摄氏度'){advice="天气较冷，运动前做好热身运动"}
else if(e.detail.value=='10~25摄氏度'){advice="天气凉爽，适宜运动"}
else if(e.detail.value=='高于25摄氏度'){advice="天气炎热，注意补水补充无机盐 "}
    this.setData({
      tem: items,
      checked_value: e.detail.value,
      advice:advice
    })
  },
})