const cloud = require('wx-server-sdk')
cloud.init({
  env: 'pro-wir1p',
  throwOnNotFound: false
})
const db = cloud.database()


exports.main = async (event, context) => {   
  // 将订单的attach 数据存储到数据库中
  try {
    await db.collection('order').add({
      data: {
        _id: event.attach.orderidUUID,
        ...event.attach,
        isPay: false
      }
    })
  } catch (error) {
    console.error(error)
  }
const res = await cloud.cloudPay.unifiedOrder({
    "body" : event.body,
    "outTradeNo" : event.orderid,
    "spbillCreateIp" : "47.103.12.90",
    // "spbillCreateIp" : "127.0.0.1",
    "subMchId" : "1601997520",//这里要注意：虽然key是子商户id，实际上就是普通商户id
    "totalFee" : parseInt(event.money),//第二个坑：注意必须是数字，如果不是数字，则会报错unifiedOrder:fail wx api error: -202
    "envId": "pro-wir1p",//这里是回调函数所属的的云环境id
    "functionName": "pay_cb",//这个是回调函数名
    "nonceStr":event.nonceStr,//第三个坑：官方文档中相关云函数代码没有nonceStr和tradeType，测试的时候会报nonceStr不存在的错，翻看文档才发现这个是必填项，直接粘过来以后还需要加上这两个参数
    "tradeType":"JSAPI"
  })
  return res
}
