const app = getApp()
import api from "../../utils/api.js"

Component({
  data: {
    cardCur: 0,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    height: "40px",
    loding: true,
    type: "全部",
    active: 0
  },
  created() {
    this.list()
    wx.setNavigationBarTitle({
      title: "计算机学术论文助手"
    })
  },
  properties: {
    list: {
      type: Object,
      default: ''
    },
    loding: {
      type: Boolean,
      default: true
    },
  },
  watch: {
    'active': function (a, b) {
      console.log(a)
      wx.pageScrollTo({
        scrollTop: 0
      })
    },
  },
  methods: {
    // 跳转到搜索页面
    jump_to_search: function (e) {
      console.log(e.currentTarget.dataset.id)
      wx.navigateTo({
        url: "../work/" + e.currentTarget.dataset.url
      })
    },
    show_xl() {
      if (this.data.height == "auto") {
        this.setData({
          height: "40px"
        })
      } else {
        this.setData({
          height: "auto"
        })
      }
    },
    onClick(event) {
      app.globalData.type = event.detail.name
      let that = this
      wx.pageScrollTo({
        scrollTop: 0
      })
      that.setData({
        active: event.detail.name
      })
    },
    onChange(e) {
      this.setData({
        loding: true,
        type: e.currentTarget.dataset.type
      })
      this.triggerEvent('tab_xz', e.currentTarget.dataset.type)
    },
    list() {
      api.GET_conference_cutdown.then(res => {
        for (var i = 0; i < res.length; i++) {
          if (res[i].time_accept) {
            res[i].time_accept = new Date(new Date(new Date(res[i].time_accept).toJSON()) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
          }
          if (res[i].time_meeting) {
            res[i].time_meeting = new Date(new Date(new Date(res[i].time_meeting).toJSON()) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
          }

          if (res[i].time_abs) {
            res[i].time_abs = new Date(new Date(new Date(res[i].time_abs).toJSON()) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
          }
          if (res[i].time) {
            res[i].time = new Date(new Date(new Date(res[i].time).toJSON()) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
          }

        }
        this.setData({
          cutdown_list: res
        })
      })

      // 按照浏览量获取数据
      api.GET_conference_browse.then(res => {
        for (var i = 0; i < res.length; i++) {
          if (res[i].time_accept) {
            res[i].time_accept = new Date(new Date(new Date(res[i].time_accept).toJSON()) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
          }
          if (res[i].time_meeting) {
            res[i].time_meeting = new Date(new Date(new Date(res[i].time_meeting).toJSON()) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
          }

          if (res[i].time_abs) {
            res[i].time_abs = new Date(new Date(new Date(res[i].time_abs).toJSON()) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
          }
          if (res[i].time) {
            res[i].time = new Date(new Date(new Date(res[i].time).toJSON()) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
          }

        }
        this.setData({
          rb_list: res
        })
      })
      // 获取首页顶部swiper数据
      api.GET_swiper.then(res => {
        this.setData({
          swiperList: res
        })
      })
    },
    tz_swiper(e) {
      wx.navigateTo({
        url: "../../pages/work/details_work/index?id=" + e.currentTarget.dataset.url
      })
    },
    // cardSwiper
    cardSwiper(e) {
      this.setData({
        cardCur: e.detail.current
      })
    },
    tz: function (e) {
      wx.navigateTo({
        url: "../../pages/" + e.currentTarget.dataset.url + "?id=" + e.currentTarget.dataset.id
      })
    },
  },
})