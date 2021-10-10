import envId from "../../utils/config.js"
const api = require('../../utils/api.js');
const util = require('../../utils/util.js')
const db = wx.cloud.database({
  env: envId.envId
})
const app = getApp()
var startY = 0,
  moveY = 0,
  pageAtTop = true;
Component({
  /**
   * 组件的初始数据
   */
  data: {
    show3: true,
    avatarUrl: "https://s1.ax1x.com/2020/07/28/aAdel6.jpg",
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    nickName: "游客",
    signBtnTxt: "每日打卡",
    visitTotal: 0,
    signedDays: 0, //连续签到天数
    show: false,
    coverTransform: "translateY(0px)",
    coverTransition: "0s",
    moving: !1,
    iconList: [{
      icon: 'favorfill',
      color: 'yellow',
      badge: 0,
      name: '我的收藏',
      data_page: "user/collect/index",
      bindtap: "bindCollect"
    }, {
      icon: 'appreciatefill',
      color: 'red',
      badge: 0,
      name: '我的点赞',
      data_page: "user/star/index",
      bindtap: "bindZan"
    }, {
      icon: 'noticefill',
      color: 'orange',
      badge: 0,
      name: '我的消息',
      
      data_page: "user/notice/notice",
      bindtap: "bindNotice"
    },{
      icon: 'infofill',
      color: 'yellow',
      badge: 0,
      name: '关于',
      data_page: "user/about/about",
      bindtap: "bindCollect"
    }, {
      icon: 'formfill',
      color: 'blue',
      badge: 0,
      name: '历史版本',
      data_page: "user/release/release",
      bindtap: "showRelease"
    }, {
      icon: 'goodsfavor',
      color: 'green',
      badge: 0,
      name: '我的积分',
      data_page: "user/point/point",
      bindtap: "bindPoint"
    }]
  },
  pageLifetimes: {
    show: async function () {
      this.sq()
      await this.getMemberInfo()
    },

  },
  created: async function() {
    this.sq()
    await this.getMemberInfo()
    await this.getViewNum()
    await api.addViewNum()
    console.log(wx.getStorageSync('userid'))
    wx.setNavigationBarTitle({
      title: "个人中心"
    })
  },
  methods: {
    jump_add_note: function (e) {
      console.log(e.currentTarget.dataset.id)
      wx.navigateTo({
        url: "../../../pages/" + e.currentTarget.dataset.url
      })
    },
    sz() {
      wx.openSetting({
        success: function (res) {}
      })

    },
    sq2() {
      var user = app.globalData.user
      this.data.setData({
        list: user
      })
    },
    hideModal() {
      this.setData({
        show: false
      })
    },
      /**
   * 签到列表
   * @param {*} e 
   */
  btnSigned: async function (e) {
    wx.navigateTo({
      url: '../user/sign/sign?signedDays=' + this.data.signedDays + '&signed=' + this.data.signed + '&signedRightCount=' + this.data.signedRightCount
    })
  },
   /**
   * @param {} visitTotal
   */
  getViewNum: async function () {
    let that = this;
    let res = await api.getViewNum();
    that.setData({
      visitTotal: res.data[0].visitTotal
    })
    // 然后每隔一秒执行一次倒计时函数(局部刷新)
  },
    /**
   * 获取用户信息
   * @param {} e 
   */
  getMemberInfo: async function (e) {

    let that = this
    try {
      let res = await api.getMemberInfo(app.globalData.openid)
      console.info(res)
      if (res.data.length > 0) {
        let memberInfo = res.data[0]
        that.data.applyStatus = memberInfo.applyStatus
        that.vipDesc = Number(memberInfo.level) > 1 ? "VIP" : "申请VIP"
        that.sighRightCount = memberInfo.sighRightCount == undefined ? 0 : memberInfo.sighRightCount
        that.setData({
          signedDays: new Date(util.formatTime(new Date())).getTime() - new Date(memberInfo.lastSignedDate).getTime() <= 86400000 ? memberInfo.continueSignedCount : 0,
          signed: util.formatTime(new Date()) == memberInfo.lastSignedDate ? 1 : 0,
          signBtnTxt: util.formatTime(new Date()) == memberInfo.lastSignedDate ? "今日已打卡" : "每日打卡",
          // vipDesc: Number(memberInfo.level) > 1 ? "VIP" : "申请VIP",
          // isVip: Number(memberInfo.level) > 1,
          // applyStatus: memberInfo.applyStatus,
          // signedRightCount: memberInfo.sighRightCount == undefined ? 0 : memberInfo.sighRightCount
        })
      }
    } catch (e) {
      console.info(e)
    }
  },
    getUserProfile() {
      var that = this
      let userid = wx.getStorageSync('userid')

      app.userInfo()
      wx.getUserProfile({
        desc: '展示用户信息',
        success: (res) => {
          db.collection('user').doc(userid).update({
            data: {
              avatarUrl: res.userInfo.avatarUrl,
              nickName: res.userInfo.nickName,
            }
          }).then(res => {
            this.setData({
              show: false
            })
            this.sq()
          })
        }
      })
    },
    navTo: function navTo(url) {
      if (!this.data.hasLogin) {
        url = '/pages/public/login';
      }
      uni.navigateTo({
        url: url
      });
    },

    coverTouchstart(e) {
      if (this.data.pageAtTop === false) {
        return;
      }
      this.setData({
        coverTransition: 'transform .1s linear',
        startY: e.touches[0].clientY
      })
    },
    coverTouchmove(e) {
      moveY = e.touches[0].clientY;
      var moveDistance = moveY - this.data.startY;
      if (moveDistance < 0) {
        // this.data.moving = false;
        this.data.moving = true;
        if (375 + moveDistance > this.data.CustomBar + this.data.StatusBar + 140) {
          this.setData({
            heights: moveDistance
          })
        }
      } else {
        this.data.moving = true;
        if (moveDistance >= 80 && moveDistance < 100) {
          moveDistance = 80;
          this.setData({
            coverTransform: "translateY(".concat(moveDistance, "px)")
          })
        }
        if (moveDistance > 0 && moveDistance <= 80) {
          this.setData({
            coverTransform: "translateY(".concat(moveDistance, "px)")
          })
        }
      }

    },
    
    coverTouchend() {
      if (this.data.moving === false) {
        return;
      }
      console.log(this.data.heights)
      if (this.data.heights < -140) {
        this.setData({
          heights: 0
        })
      }
      this.setData({
        moving: false,
        coverTransition: 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)',
        coverTransform: 'translateY(0px)',
      })

    },
    async user_list() {
      var sc
      var dz
      var nt
      var tk
      await db.collection('collect').count().then(res => {
        sc = res.total
      })
      await db.collection('star').count().then(res => {
        dz = res.total
      })
      // await db.collection('note').count().then(res => {
      //   nt = res.total
      // })
      // await db.collection('interview_collect').count().then(res => {
      //   tk = res.total
      // })
      await this.setData({
        dz: dz,
        sc: sc,
        // nt: nt,
        // tk: tk
      })
    },
    sq() {
      let that = this
      db.collection('user').get().then(res => {
        console.log(res)
        if (res.data[0].avatarUrl) {
          this.user_list()
          that.setData({
            avatarUrl: res.data[0].avatarUrl,
            nickName: res.data[0].nickName,
            userin: res.data[0],
          })
        } else {
          this.setData({
            show: true
          })
        }
      })
    },
    tz(e) {
      console.log(e.currentTarget.dataset.id)
      console.log(e.currentTarget.dataset)
      wx.navigateTo({
        url: "../../pages/" + e.currentTarget.dataset.a + "?id=" + e.currentTarget.dataset.id
      })
      
    },
    showQrcode(e) {
      console.log(e.currentTarget.dataset.id)
      wx.previewImage({
        urls: ["cloud://test-4gn9gu0ucc6657ba.7465-test-4gn9gu0ucc6657ba-1304273986/zanshangma.png"],
        current: "cloud://test-4gn9gu0ucc6657ba.7465-test-4gn9gu0ucc6657ba-1304273986/zanshangma.png"
      })
    },

  }
})