// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {    
  const res = await cloud.cloudPay.queryOrder({
      "sub_mch_id" : "1601997520",
      "out_trade_no" : event.orderid,
      "nonceStr":event.nonceStr,
    })
    return res
  }