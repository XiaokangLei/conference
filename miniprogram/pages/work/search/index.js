// pages/work/search/index.js
import envId from "../../../utils/config.js"
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';

const db = wx.cloud.database({
  env: envId.envId
})
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchContent: "",
    lists: [],
    showTips: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "搜索"
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 获取input中的搜索内容
   */
  searchInput: function (e) {
    this.setData({
      searchContent: e.detail.value
    })
  },
  /**
   * 搜索
   */
  submitSearch: function (e) {
    let that = this;
    wx.showLoading({
      title: '搜索中...',
    })
    try {
      let where = {}
      where.abbr = db.RegExp({
        regexp: '.*' + that.data.searchContent,
        options: 'i',
      })
      // 正则表达式搜索
      db.collection('conference')
        .where(where)
        .get({
          success: res => {
            if (res.data.length > 0) {
              for (var i = 0; i < res.data.length; i++) {
                if (res.data[i].time_accept) {
                  res.data[i].time_accept = new Date(new Date(new Date(res.data[i].time_accept).toJSON()) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
                }
                if (res.data[i].time_meeting) {
                  res.data[i].time_meeting = new Date(new Date(new Date(res.data[i].time_meeting).toJSON()) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
                }

                if (res.data[i].time_abs) {
                  res.data[i].time_abs = new Date(new Date(new Date(res.data[i].time_abs).toJSON()) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
                }
                if (res.data[i].time) {
                  res.data[i].time = new Date(new Date(new Date(res.data[i].time).toJSON()) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
                }

              }
              that.setData({
                lists: res.data,
              })
            } else {
              that.setData({
                lists: [],
              })
              Dialog.alert({
                title: '温馨提示',
                message: '未搜索到相关信息 请尝试其他关键词搜索',
                theme: 'round-button',
              }).then(() => {
                // on close
              });
            }
            that.setData({
              showTips: false,
            })
          },
          fail: err => {
            console.log(err)
          }
        })
    } catch (err) {
      console.info(err)
    } finally {
      wx.hideLoading()
    }

  },
  /**
   * 跳转
   */
  tz: function (e) {
    console.log("../../" + e.currentTarget.dataset.url + "?id=" + e.currentTarget.dataset.id)
    wx.navigateTo({
      url: "../../" + e.currentTarget.dataset.url + "?id=" + e.currentTarget.dataset.id
    })
  }
})