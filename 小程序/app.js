//app.js
const defaultTime = {
  defaultRunTime: 25,
  defaultStudyTime: 5
}
App({
  onLaunch: function () {
    let runTime = wx.getStorageSync('runTime')
    let studyTime = wx.getStorageSync('studyTime')
    if (!runTime) {
      wx.setStorage({
        key: 'runTime',
        data: defaultTime.defaultWorkTime
      })
    }
    if (!studyTime) {
      wx.setStorage({
        key: 'studyTime',
        data: defaultTime.defaultRestTime
      })
    }
  },
  globalData: {
    userInfo: null,
    currentWeather: "",
    currentWea: "",
    currentIcon: "",
  }
})