const util = require('../../utils/clock.js')
const defaultLogName = {
  run: '跑步',
  study: '学习'
}
const actionName = {
  run: '跑步',
  study: '学习'
}
Page({
  data: {
    remainTimeText: '',
    timerType: 'run',
    log: {},
    completed: false,
    isRuning: false,
    checked_value:"",
    sport:[
      {        value:"长跑",checked:false      },
      {        value:"足篮球",checked:false      },
      {        value:"羽毛球",checked:false      },
      {        value:"骑车",checked:false      },
    ]
  },
  //运动选择标签按钮//
  change2:function(e){
    
let items=this.data.sport;
console.log(e.detail)
for(let i=0;i<items.length;i++)
{items[i].checked=items[i].value===e.detail.value}
var advice='';
if(e.detail.value=='长跑'){advice="热身大约在三到五分钟,开始跑时不可以过快，根据自己的能力，重在把呼吸和步速调整好,过快会出现后续体力跟不上，呼吸乱，胸口痛，对身体不好，最好用前脚掌，这样可以起到缓冲的作用，减轻人体对脚的压力。"}
else if(e.detail.value=='足篮球'){advice="活动手腕，可以提前调整协调性，找到我们投篮的感觉。活动膝盖，比如：下蹲。扭动脚踝 ，脚踝是我们打篮球最容易受伤的地方之一。在野球场上，最经常看到的运动伤害就是崴脚。所以，我们在比赛上场前要充分扭动我们的脚踝。扭腰运动  扭腰能够让我们的身体更有协调性。运球训练  比赛用球一般不是自带的。提前进行运球训练，能够让你更好地熟悉比赛用球和场地。投篮训练  投篮，不只是靠在球场上的锻炼，还需要做好赛前的准备。"}
else if(e.detail.value=='羽毛球'){advice="通常的准备活动多是伸展运动，其中有静态伸展运动和动态伸展运动两种。静态伸展运动需要我们把肌肉拉伸到最紧的那一点后，继续保持一会儿；动态伸展运动则多是些快速的运动练习。"}
else if(e.detail.value=='骑车'){advice="运动前一定要热身，舒展身体和每一寸肌肉，不只固定在运动前拉筋而已，在运动过程中、后进行缓和的静态舒展也很重要。请记住，最好在骑乘的一小时前就开始热身准备，提醒自己的身体准备要开始动作了，将会有长时间的骑乘。连续数小时内上半身维持同样姿势，下半身又不停地往前，一定会感到酸痛，更有可能抽筋。所以，骑乘前和途中最好能停下来动动全身，解除心理上的紧张和压力，让筋和肌肉放松下来。  "}
this.setData({
  sport:items,
  checked_value:e.detail.value,
  advice:advice
})  },
onShow: function() {
  //显示计时
  if (this.data.isRuning) return
  let runTime = util.formatTime(wx.getStorageSync('runTime'), 'HH')//调用API定义
  let studyTime = util.formatTime(wx.getStorageSync('studyTime'), 'HH')
  this.setData({
    runTime: runTime,
    studyTime: studyTime,
    remainTimeText: runTime + ':00'
  })  },
    //API链接//
  weather:function(){
    wx.navigateTo({
      url: '../weather_forecast/weather_forecast',
    })  },
  place:function(){
    wx.navigateTo({
        url: '../place/place',
    })  },
      //开始计时
  startTimer: function(e) {
    let startTime = Date.now()
    let isRuning = this.data.isRuning
    let timerType = e.target.dataset.type
    let showTime = this.data[timerType + 'Time']
    let keepTime = showTime * 60 * 1000
    let logName = this.logName || defaultLogName[timerType]//为变量赋值
    if (!isRuning) {
      this.timer = setInterval((function() {
        this.updateTimer()
        
      }).bind(this), 1000)
    } else {
      this.stopTimer()
    }
    this.setData({
      isRuning: !isRuning,
      completed: false,
      timerType: timerType,
      remainTimeText: showTime + ':00',
      taskName: logName
    })
    this.data.log = {
      name: logName,
      startTime: Date.now(),
      keepTime: keepTime,
      endTime: keepTime + startTime,
      action: actionName[isRuning ? 'stop' : 'start'],
      type: timerType
    }  },

  stopTimer: function() {
    // 停止计时
    this.timer && clearInterval(this.timer)
  },
  updateTimer: function() {
    //更新计时
    let log = this.data.log
    let now = Date.now()
    let remainingTime = Math.round((log.endTime - now) / 1000)
    let H = util.formatTime(Math.floor(remainingTime / (60 * 60)) % 24, 'HH')
    let M = util.formatTime(Math.floor(remainingTime / (60)) % 60, 'MM')
    let S = util.formatTime(Math.floor(remainingTime) % 60, 'SS')
    if (remainingTime > 0) {
      let remainTimeText = (H === "00" ? "" : (H + ":")) + M + ":" + S
      this.setData({
        remainTimeText: remainTimeText
      })
    } else if (remainingTime == 0) {
      this.setData({
        completed: true
      })
      this.stopTimer()
      return
    }  },})
