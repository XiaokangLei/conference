//app.js
var util = require('/utils/time.js');
import envId from "/utils/config.js"
App({
  // 引入`towxml3.0`解析方法
  towxml:require('/towxml/index'),
  onLaunch: function () {
    if (wx.cloud) {
      wx.cloud.init({
        env: envId.envId
      })
    }
    var openid = wx.getStorageSync('openid');
      if (openid) {
        this.globalData.openid = openid
      } else {
        wx.cloud.callFunction({
          name: 'login',
          data: {},
          success: res => {
            this.globalData.openid = res.result.openid
            wx.setStorageSync('openid', res.result.openid);
          },
          fail: err => {
            console.error('[云函数] [login] 调用失败', err)
          }
        })
      }
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })
    this.userInfo();
    this.updateManager();
  },
  /**
   * 登录验证
   * @param {} cb 
   */
  checkUserInfo: function (cb) {
    let that = this
    if (that.globalData.userInfo) {
      typeof cb == "function" && cb(that.globalData.userInfo, true);
    } else {
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: function (res) {
                that.globalData.userInfo = JSON.parse(res.rawData);
                typeof cb == "function" && cb(that.globalData.userInfo, true);
              }
            })
          } else {
            typeof cb == "function" && cb(that.globalData.userInfo, false);
          }
        }
      })
    }
  },

  access_token: null,
  logout: function () {
    wx.removeStorageSync('access_token');
    this.access_token = null;
  },
  getUserInfo: function (callback) {
    var that = this;
    if (that.access_token) {
      wx.request({
        url: that.config.apiUrl + "api/v5/user",
        method: "GET",
        data: {
          access_token: that.access_token,
        },
        success: function (result) {
          if (result.data.hasOwnProperty('id')) {
            that.userInfo = result.data;
            callback(true);
          } else {
            callback(false);
          }
        }
      });
    } else {
      that.access_token = wx.getStorageSync("access_token");
      if (that.access_token) {
        that.getUserInfo(callback);
      } else {
        callback(false);
      }
    }
  },
    /**
   * 小程序主动更新
   */
  updateManager() {
    if (!wx.canIUse('getUpdateManager')) {
      return false;
    }
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
    });
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '有新版本',
        content: '新版本已经准备好，即将重启',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      });
    });
    updateManager.onUpdateFailed(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false
      })
    });
  },
  userInfo: function () {
    const db = wx.cloud.database({
      env: envId.envId
    })
    db.collection('user').get({
    success: function (res) {
      if (res.data.length > 0) {
        console.log('*************************************')
        console.log(res.data)
        wx.setStorageSync('userid', res.data[0]._id)
        wx.setStorageSync('openid', res.data[0]._openid)
        db.collection('user').doc("" + res.data[0]._id).update({
          data: {
            endtime: util.getCurrentTime()
          }
        })
        // wx.setStorageSync('access_token', res.data[0].gitee_token);
        // wx.setStorageSync('access_token', res.data[0].gitee_token);
      } else {
        console.log('##############################################')
        db.collection('user').add({
          data: {
            addtime: util.getCurrentTime()
          },
          success: function (res) {
            wx.setStorageSync('userid', res._id)
          }
        })
      }
      }
    })
  },
  config: {
    apiUrl: "https://gitee.com/", //通用API地址
    mock:false
  },
  loadFont() {
    wx.loadFontFace({
      family: 'Roboto',
      source: 'url(https://static.hamm.cn/font/Gotham-Book.woff2)',
    });
  },
  globalData: {
    key: '31c76e2a2d784c129e5518817054b111',
    type: 0,
    requestUrl: {
      weather: 'https://free-api.heweather.com/s6/weather',
    },
    openid: "",
    userInfo: null,
    advert: {},
    lastLoginDate: "",//最后登录时间
    ColorList: [{
      title: '嫣红',
      name: 'red',
      color: '#e54d42'
    },
    {
      title: '桔橙',
      name: 'orange',
      color: '#f37b1d'
    },
    {
      title: '明黄',
      name: 'yellow',
      color: '#fbbd08'
    },
    {
      title: '橄榄',
      name: 'olive',
      color: '#8dc63f'
    },
    {
      title: '森绿',
      name: 'green',
      color: '#39b54a'
    },
    {
      title: '天青',
      name: 'cyan',
      color: '#1cbbb4'
    },
    {
      title: '海蓝',
      name: 'blue',
      color: '#0081ff'
    },
    {
      title: '姹紫',
      name: 'purple',
      color: '#6739b6'
    },
    {
      title: '木槿',
      name: 'mauve',
      color: '#9c26b0'
    },
    {
      title: '桃粉',
      name: 'pink',
      color: '#e03997'
    },
    {
      title: '棕褐',
      name: 'brown',
      color: '#a5673f'
    },
    {
      title: '玄灰',
      name: 'grey',
      color: '#8799a3'
    },
    {
      title: '草灰',
      name: 'gray',
      color: '#aaaaaa'
    },
    {
      title: '墨黑',
      name: 'black',
      color: '#333333'
    },
    {
      title: '雅白',
      name: 'white',
      color: '#ffffff'
    },]
  },

})