<template>
  <div>
    <button type="default" @click="getUserLocatin">获取用户通讯地址</button>
    {{ userAddressInfo.userName }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      userAddressInfo: this.$localStore.get("userAddressInfo"),
    };
  },
  mounted() {
    this.pageLogin();
  },
  computed: {},
  methods: {
    pageLogin() {
      // 如果当前用户未授权
      wx.login({
        success: (res) => {
          // 获取到用户的 code 之后：res.code
          console.log("用户的code：" + res.code);
          // 可以传给后台，再经过解析获取用户的 openid
          // 或者可以直接使用微信的提供的接口直接获取 openid ，方法如下：
          wx.request({
            url: "https://api.weixin.qq.com/sns/jscode2session", //接口地址
            data: {
              appid: "wxafd014ef39980177",
              secret: "979625ca6571f4080b94610b4e024ed8",
              js_code: res.code,
              grant_type: "authorization_code",
            },
            header: {
              "content-type": "application/json", //默认值
            },
            success: function(res) {
              console.log(res.data);
              let OPEN_ID = res.data.openid; //获取到的openid
              let SESSION_KEY = res.data.session_key; //获取到session_key
              console.log(OPEN_ID);
              console.log(SESSION_KEY);
              //如果返回成功，则将OPEN_ID和SESSION_KEY提交请求给本地服务器
              // wx.request({
              //   url: 'http://127.0.0.1:8080/wxapplogin/login.jsp',
              //   data: {
              //     open_id: OPEN_ID,
              //     session_key: SESSION_KEY,
              //     gender: GENDER,
              //     province: PROVINCE,
              //     city: CITY
              //   },
              //   header: {
              //     'content-type': 'application/json' //默认值
              //   },
              //   method: 'GET'
              // })
            },
          });
        },
      });
    },
    getUserLocatin() {
      let that = this;
      wx.getSetting({
        success(res) {
          console.log(
            "vres.authSetting['scope.address']：",
            res.authSetting["scope.address"]
          );
          if (res.authSetting["scope.address"]) {
            console.log("111");
            wx.chooseAddress({
              success(res) {
                console.log(res.userName); // 胡辉
                console.log(res.postalCode); // 401120
                console.log(res.provinceName); // 重庆市
                console.log(res.cityName); // 重庆市
                console.log(res.countyName); // 渝北区
                console.log(res.detailInfo); // 九寨印象
                console.log(res.nationalCode); // 500112
                console.log(res.telNumber); //15330367593
                let {
                  userName,
                  provinceName,
                  cityName,
                  countyName,
                  detailInfo,
                  telNumber,
                } = res;
                if (res.provinceName === res.cityName) {
                  that.$localStore.set("userAddressInfo", {
                    userName,
                    cityName,
                    countyName,
                    detailInfo,
                    telNumber,
                  });
                  that.userAddressInfo = that.$localStore.get(
                    "userAddressInfo"
                  );
                } else {
                  that.$localStore.set("userAddressInfo", {
                    userName,
                    provinceName,
                    cityName,
                    countyName,
                    detailInfo,
                    telNumber,
                  });
                  that.userAddressInfo = that.$localStore.get(
                    "userAddressInfo"
                  );
                }
              },
              fail(e) {
                console.log(e);
                that.$toast("您取消了地址位置授权，请选择确定");
              },
            });
          } else {
            if (res.authSetting["scope.address"] == false) {
              console.log("222");
              wx.openSetting({
                success(res) {
                  console.log(res.authSetting);
                },
              });
            } else {
              // 第一次打开小程序
              console.log("eee");
              wx.chooseAddress({
                success(res) {
                  console.log(res.userName);
                  console.log(res.postalCode);
                  console.log(res.provinceName);
                  console.log(res.cityName);
                  console.log(res.countyName);
                  console.log(res.detailInfo);
                  console.log(res.nationalCode);
                  console.log(res.telNumber);
                  let {
                    userName,
                    provinceName,
                    cityName,
                    countyName,
                    detailInfo,
                    telNumber,
                  } = res;
                  if (res.provinceName === res.cityName) {
                    that.$localStore.set("userAddressInfo", {
                      userName,
                      cityName,
                      countyName,
                      detailInfo,
                      telNumber,
                    });
                  } else {
                    that.$localStore.set("userAddressInfo", {
                      userName,
                      provinceName,
                      cityName,
                      countyName,
                      detailInfo,
                      telNumber,
                    });
                  }
                },
                fail(e) {
                  that.$toast("您取消了地址位置授权，请选择确定");
                },
              });
            }
          }
        },
      });
    },
  },
};
</script>

<style></style>
