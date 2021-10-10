// miniprogram/pages/details/index.js
import envId from "../../../utils/config.js"
const api = require('../../../utils/api.js');
const time = require('../../../utils/time.js')
const db = wx.cloud.database({
  env: envId.envId
})

const _ = db.command
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    deta: {},
    html: "",
    sc_show: false,
    dz_show: false,
    fx_show: true,
    commentContent: "",
    commentPage: 1,
    commentList: [],
    placeholder: "评论...",
    focus: false,
    commentId: "",
    isFocus: false,
    // 用户头像，默认为改图片
    avatarUrl: "https://s1.ax1x.com/2020/07/28/aAdel6.jpg",
    nickName: "匿名用户",
    // 是否授权
    isLogin: false,
    show: false,
  },
  pageLifetimes: {
    show: function () {
      this.sq()
    },
  },
  top() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  // input聚焦时
  onInputFocus() {
    this.setData({
      isFocus: true
    });
  },

  initial: function (id) {
    this.setData({
      loding: true
    })
    wx.cloud.callFunction({
      name: "details",
      data: {
        id: this.data.id,
      },
    }).then(res => {
      let result = res.result.details.content
      this.setData({
        loding: false
      })
      result = app.towxml(result, 'markdown');
      console.log(result)
      // result = result.replace(/<img/gi, '<img class="img_yl" style="max-width:100%;height:auto;margin: 0 auto;display:block" ')
      //   .replace(/<code/gi, '<code  class="language-css" ')
      //   .replace(/<br\/>/g, "\n");
      // time.formatTime(new Date())
      // time.formatTime(res.result.details.time)
      console.log(res.result.details.time_accept)
      res.result.details.time = new Date(new Date(new Date(res.result.details.time).toJSON()) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
      res.result.details.time_accept = new Date(new Date(new Date(res.result.details.time_accept).toJSON()) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
      console.log(res.result.details.time_accept)
      // res.result.details.time = this.UTCformat(res.result.details.time)
      // console.log(res.result.details.time)

      // res.result.details.time = '2021-09-08'

      this.setData({
        // html: result,
        markdown: result,
        xw_list: res.result.details
      })
    })

  },
  UTCformat: function (utc) {
    var date = new Date(utc),
      year = date.getFullYear(),
      month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + parseInt(date.getMonth() + 1),
      day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate(),
      hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours(),
      minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes(),
      seconds = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds();
    var res = year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds; //将上述拆分的数据整合，连接符可以自己决定，如ios无法识别2xxx-xx-xx格式可将'-'改为'/'
    return res;
  },
  initial_tx: function () {
    // db.collection('conference').doc(this.data.id).get().then(res => {
    //   this.setData({
    //     xw_list: res.data,
    //   })
    // })
    wx.cloud.callFunction({
      name: "details_cs",
      data: {
        id: this.data.id,
      },
    }).then(res => {
      this.setData({
        sc_show: res.result.collect,
        dz_show: res.result.star
      })
    })
  },

  tz: function (e) {
    wx.navigateTo({
      url: "../../../pages/" + e.currentTarget.dataset.url + "?wzid=" + e.currentTarget.dataset.id
    })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  star_sc(e) {
    let openid = wx.getStorageSync("openid")
    if (openid) {
      let that = this
      wx.showToast({
        title: "玩命加载中",
        icon: 'loading',
        mask: true,
        duration: 2000
      })
      let data = this.data.xw_list
      data.press_id = data._id
      console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=")
      console.log(e.currentTarget.dataset.id)
      console.log(this.data.xw_list)
      
      wx.cloud.callFunction({
        name: e.currentTarget.dataset.id,
        data: {
          press: this.data.xw_list,
          // conference_id: this.data.xw_list.press_id
        },
      }).then(res => {
        wx.showToast({
          title: res.result,
          duration: 1000,
          icon: 'none',
          mask: true
        })
        this.initial_tx(that.data.id)
      })
    } else {
      wx.showToast({
        title: '您尚未登录',
        duration: 1000,
        icon: 'none',
        mask: true
      })
    }
  },


  dz_l() {
    db.collection('conference').where({
      _id: this.data.xw_list._id
    }).update({
      data: {
        star: 10
      }
    }).then(res => {
      this.initial(this.data.id)
    })
  },
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.initial(options.id)
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    wx.cloud.callFunction({
      name: "details_cs",
      data: {
        id: this.data.id,
      },
    }).then(res => {
      this.setData({
        sc_show: res.result.collect,
        dz_show: res.result.star
      })
    })
  },
  onShareAppMessage: function (res) {
    this.setData({
      fx_show: false
    })
    return {
      title: this.data.xw_list.tille,
      path: '/pages/index/index?id=' + this.data.id + "&share=true",
      imageUrl: this.data.xw_list.img || "",
    }
  },

  onShareTimeline: function (res) {
    return {
      title: this.data.xw_list.tille,
      imageUrl: this.data.xw_list.img
    }
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
    this.setData({
      fx_show: true
    })
    this.sq()
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

  commentInput: function (e) {
    this.setData({
      commentContent: e.detail.value
    })
  },
  // 获取用户信息
  getUserProfile() {
    var that = this
    let userid = wx.getStorageSync('userid')
    let openid = wx.getStorageSync('openid')

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
        })
      }
    })
  },
  hideModal() {
    this.setData({
      show: false
    })
  },
  sq() {
    let that = this
    db.collection('user').get().then(res => {
      if (res.data[0].avatarUrl) {
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
  /**
   * 评论 new
   */
  submitCommend: async function (e) {
    await this.sq()
    if (this.data.show) {
      await this.getUserProfile();
    } else {
      let that = this
      let commentPage = 1
      let content = that.data.commentContent;
      if (content == undefined || content.length == 0) {
        wx.showToast({
          title: '请输入内容',
          icon: 'none',
          duration: 1500
        })
        return
      }
      // 提交评论的提示
      wx.showToast({
        title: '提交评论~',
        icon: 'loading',
        duration: 3000,
        success: async function () {
          let checkResult = await api.checkPostComment(content)
          if (!checkResult.result) {
            wx.showToast({
              title: '评论内容存在敏感信息',
              icon: 'none',
              duration: 2000
            })
            return
          }
          console.log('-------------------------------------')
          console.log(that.data)
          // 评论文章
          if (that.data.commentId === "") {
            var data = {
              postId: that.data.xw_list._id,
              cNickName: that.data.nickName,
              cAvatarUrl: that.data.avatarUrl,
              cOpenId: that.data.userin._openid,
              timestamp: new Date().getTime(),
              createDate: time.formatTime(new Date()),
              comment: content,
              childComment: [],
              flag: 1,
            }
            await api.addPostComment(data, '')
          }
          // 评论别人的评论（子评论） 
          else {
            var childData = [{
              cOpenId: that.data.userin._openid,
              cNickName: that.data.nickName,
              cAvatarUrl: that.data.avatarUrl,
              timestamp: new Date().getTime(), //new Date(),
              createDate: time.formatTime(new Date()),
              comment: content,
              tNickName: that.data.toName,
              tOpenId: that.data.toOpenId,
              flag: 1,
            }]
            await api.addPostChildComment(that.data.commentId, that.data.xw_list._id, childData, '')
          }
          let commentList = await api.getPostComments(commentPage, that.data.xw_list._id)
          if (commentList.data.length === 0) {
            that.setData({
              nomore: true
            })
            if (commentPage === 1) {
              that.setData({
                nodata: true
              })
            }
          } else {
            let xw_list = that.data.xw_list;
            xw_list.totalComments = xw_list.totalComments + 1
            that.setData({
              isFocus: false,
              commentPage: commentPage + 1,
              commentList: commentList.data,
              commentContent: "",
              nomore: false,
              nodata: false,
              xw_list: xw_list,
              commentId: "",
              placeholder: "留下足迹......",
              focus: false,
              toName: "",
              toOpenId: ""
            })
          }
          wx.showToast({
            title: '评论成功',
            icon: 'success',
            duration: 500
          })
        }
      })
    }
  },
  /**
   * 失去焦点时
   * @param {*} e 
   */
  onReplyBlur: function (e) {
    let that = this;
    const text = e.detail.value.trim();
    if (text === '') {
      that.setData({
        isFocus: false,
        commentId: "",
        placeholder: "留下足迹......",
        toName: ""
      });
    }
  },
  /**
   * 点击评论内容回复
   */
  focusComment: function (e) {
    let that = this;
    let name = e.currentTarget.dataset.name;
    let commentId = e.currentTarget.dataset.id;
    let openId = e.currentTarget.dataset.openid;
    that.setData({
      commentId: commentId,
      placeholder: "回复" + name + ":",
      focus: true,
      toName: name,
      toOpenId: openId
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function () {
    // 触底加载评论
    wx.showLoading({
      title: '加载评论...',
    })
    try {
      let that = this;
      if (that.data.nomore === true)
        return;
      let page = that.data.commentPage;
      let commentList = await api.getPostComments(page, that.data.xw_list._id)
      if (commentList.data.length === 0) {
        that.setData({
          nomore: true
        })
        if (page === 1) {
          that.setData({
            nodata: true
          })
        }
      } else {
        that.setData({
          commentPage: page + 1,
          commentList: that.data.commentList.concat(commentList.data),
        })
      }
    } catch (err) {
      console.info(err)
    } finally {
      wx.hideLoading()
    }
  },

})