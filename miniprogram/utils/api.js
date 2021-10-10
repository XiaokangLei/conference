var task = require("./request.js")
import envId from "./config.js"
import time from "./time.js"

const app = getApp()
const db = wx.cloud.database({
  env: envId.envId
})
const _ = db.command

/**
 * 新增评论
 */
function addPostComment(commentContent, accept) {
  return wx.cloud.callFunction({
    name: 'postsService',
    data: {
      action: "addPostComment",
      commentContent: commentContent,
      accept: accept
    }
  })
}

/**
 * 新增子评论
 * @param {} id 
 * @param {*} comments 
 */
function addPostChildComment(id, postId, comments, accept) {
  return wx.cloud.callFunction({
    name: 'postsService',
    data: {
      action: "addPostChildComment",
      id: id,
      comments: comments,
      postId: postId,
      accept: accept
    }
  })
}

// 评论内容安全检查
function checkPostComment(content) {
  return wx.cloud.callFunction({
    name: 'postsService',
    data: {
      action: "checkPostComment",
      content: content
    }
  })
}


/**
 * 获取会员信息
 * @param {} openId 
 */
function getMemberInfo(openId) {
  return db.collection('mini_member')
    .where({
      _openId: openId
    })
    .get()
}

/**
 * 获取总浏览量信息
 * @param {} viewcount 
 */
function getViewNum() {
  return db.collection('mini_config')
      .where({
          key: 'viewcount'
      })
      .get()
}


/**
 * 新增浏览量
 */
function addViewNum() {
  return wx.cloud.callFunction({
      name: 'postsService',
      data: {
          action: "addViewNum"
      }
  })
}

/**
 * 获取消息列表
 * @param {*} page 
 */
function getNoticeLogsList(page, openId) {
  return db.collection('mini_logs')
      .orderBy('timestamp', 'desc')
      .skip((page - 1) * 10)
      .limit(10)
      .get()
}
/**
 * 获取版本发布日志
 * @param {*} page 
 */
function getReleaseLogsList(page) {
  return db.collection('mini_logs')
      .where({
          key: 'releaseLogKey'
      })
      .orderBy('timestamp', 'desc')
      .skip((page - 1) * 10)
      .limit(10)
      .get()
}

/**
 * 获取积分明细列表
 * @param {*} page 
 * @param {*} openId 
 */
function getPointsDetailList(page,openId)
{
    return db.collection('mini_point_detail')
    .where({
        openId: openId
    })
    .orderBy('createTime', 'desc')
    .skip((page - 1) * 20)
    .limit(20)
    .get()
}

/**
 * 获取评论列表
 * @param {} page 
 * @param {*} postId 
 */
function getPostComments(page, postId) {
  return db.collection('mini_comments')
    .where({
      postId: postId,
      flag: 0
    })
    .orderBy('timestamp', 'desc')
    .skip((page - 1) * 10)
    .limit(10)
    .get()
}

module.exports = {
  GET_conference: task.Tree_get(db.collection('conference').limit(4).orderBy('_createTime', 'asc')),
  GET_conference_cutdown: task.Tree_get(db.collection('conference').limit(20).where({
    time: _.gte(time.formatTimeOnly(new Date(Date.now())))
  }).orderBy('time', 'asc')),
  GET_conference_browse: task.Tree_get(db.collection('conference').limit(20).orderBy('browse', 'desc')),
  GET_news_top: task.Tree_get(db.collection('news').limit(3).orderBy('browse', 'desc')),
  GET_news: task.Tree_get(db.collection('news').orderBy('add_time', 'desc')),
  GET_swiper: task.Tree_get(db.collection('mini_swiperList')),
  GET_news_swiper: task.Tree_get(db.collection('news_swiperList')),
  getPostComments: getPostComments,
  checkPostComment: checkPostComment,
  getMemberInfo: getMemberInfo,
  addPostChildComment: addPostChildComment,
  addPostComment: addPostComment,
  getNoticeLogsList:getNoticeLogsList,
  getReleaseLogsList:getReleaseLogsList,
  getPointsDetailList:getPointsDetailList,
  getViewNum:getViewNum,
  addViewNum:addViewNum,
}