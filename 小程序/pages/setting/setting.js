Page({
  onShow: function() {
    //首页时间与本页进度条保持一致
    wx.setNavigationBarTitle({
      title: '设置'
    })
    this.setData({
    	runTime: wx.getStorageSync('runTime'),
    	studyTime: wx.getStorageSync('studyTime')
    })
  },
  changeRunTime: function(e) {
    //滑动进度条改变对应值
  	wx.setStorage({
  		key: 'runTime',
  		data: e.detail.value
  	})
  },
  changeStudyTime: function(e) {
     //滑动进度条改变对应值
  	wx.setStorage({
  		key: 'studyTime',
  		data: e.detail.value
  	})
  }
})
