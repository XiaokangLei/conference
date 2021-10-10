// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const _ = db.command
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  async function pota() {
    let collect = await db.collection('collect').where({
      _id: event.id + wxContext.OPENID
    }).get()
    let star = await db.collection('star').where({
      _id: event.id + wxContext.OPENID
    }).get()
    return {
      collect: collect.data.length ? true : false,
      star: star.data.length ? true : false,
    }
  }
  return await pota()
}