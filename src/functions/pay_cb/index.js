// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(cloud.getWXContext().ENV)
  const orderId = event.outTradeNo
  const resultCode = event.resultCode
  if (resultCode === 'SUCCESS') {
    return { errcode: 0 }
  }
}