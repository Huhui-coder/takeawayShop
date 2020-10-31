// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')

cloud.init({
  env: 'pro-wir1p',
  throwOnNotFound: false
})
const db = cloud.database()

exports.main = async (event, context) => {
  console.log('event', event)
  const resultCode = event.resultCode
  const returnCode = event.returnCode
  const orderId = event.outTradeNo

  if (resultCode === 'SUCCESS' && returnCode === 'SUCCESS') {
    // 首先判断是否已经处理过了
    let doc = await db.collection('order').doc(orderId).get()
    if (doc.data.isPay === true) {
      return { errcode: 0, errmsg:'SUCCESS' }
    }
    // 去数据库里查找 对应的订单，并将对应的状态改为 true
    await db.collection('order').doc(orderId).update({
      data: {
        isPay: true
      }
    })
  try {
    let res = await db.collection('order').doc(orderId).get()
    let params = res.data
    delete res.data._id
    console.log('数据库内容', res)
    console.log('请求数据参数', params)
    await rp({
      url: 'https://hit-coder.club:3000/user/order',
      method: "POST",
      json: true,
      body: params,//这里就是使用的json格式的数据
      headers: {
        "content-Type": "application/json",
      },
    })
    .then(function (res) {
      console.log('请求成功', res)
    })
    .catch(function (err) {
      console.log('请求失败')
    });
  } catch (error) {
    console.error(error)
  }
    return { errcode: 0, errmsg:'SUCCESS' }
  }
}