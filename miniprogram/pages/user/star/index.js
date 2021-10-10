import Dialog from '@vant/weapp/dialog/dialog';
import envId from "../../../utils/config.js"
const db = wx.cloud.database({
  env: envId.envId
})
const app = getApp()
Component({
  data: {
    loding: true,
    active: 0,
    tabCur: 0,
    type: "小程序",
    tab: [
      "日程",
      "资讯",
    ],
    db_value:'hy'
  },
  pageLifetimes: {
    show: function () {
      this.post()
    },
  },
  created() {
    this.post()
    wx.setNavigationBarTitle({
      title: "我的点赞"
    })
  },

  methods: {
    post() {
      let openid = wx.getStorageSync('openid')
      db.collection('star').where({
        _openid:openid,
        db_value:this.data.db_value
      }).limit(10).orderBy('add_time', 'asc').get().then(res => {
        this.setData({
          xw_list: res.data,
          loding: false
        })
      })
    },
    onChange(event) {
      this.setData({
        loding: true
      })
      var db2
      if (event.detail.title == "资讯") {
        this.setData({
          db_value : 'news'
        })
      }
      else{
        this.setData({
          db_value : 'hy'
        })
      }
      let openid = wx.getStorageSync('openid')
      db.collection('star').where({
        _openid:openid,
        db_value:this.data.db_value
      }).limit(10).orderBy('add_time', 'asc').get().then(res => {
        this.setData({
          xw_list: res.data,
          loding: false
        })
      })
    },
    tz: function (e) {
      console.log(e.currentTarget.dataset.id)
      wx.navigateTo({
        url: "../../../pages/" + e.currentTarget.dataset.a + "?id=" + e.currentTarget.dataset.id
      })
    },


  }
})