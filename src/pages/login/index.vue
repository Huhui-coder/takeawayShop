<template>
  <div>
    <button
      class="user-info-btn"
      open-type="getUserInfo"
      @getuserinfo="mpGetUserInfo"
      withCredentials="true"
    >
      微信授权登录
    </button>
    <van-button @click="isAuth">
      判断是否已经授权
    </van-button>
    <h2>{{ wxLoginParams.encryptedData }}</h2>
    <h2>{{ wxLoginParams.iv }}</h2>
  </div>
</template>

<script>
export default {
  data() {
    return {
      wxLoginParams: {
        encryptedData: "",
        iv: "",
      },
    };
  },
  methods: {
    isAuth() {
      uni.getSetting({
        success(res) {
          console.log("授权：", res);
          if (!res.authSetting["scope.userInfo"]) {
            //这里调用授权
            console.log("当前未授权");
          } else {
            //用户已经授权过了
            console.log("当前已授权");
          }
        },
      });
    },
    mpGetUserInfo(result) {
      //根据调用系统自带button携带的result信息判断是否有授权信息
      console.log(result);
      if (result.detail.errMsg !== "getUserInfo:ok") {
        wx.showToast({
          title: "取消授权",
          icon: "none",
          duration: 2000,
        });
        //hasUserInfo为存储用户是否授权信息
        uni.setStorageSync("hasUserInfo", false);
        return;
      }
      wx.checkSession({
        success() {
          console.log("有效");
          //因为用户授权后需求获取用户授权信息，所以这里必传encryptedData、iv两个参数获取用户头像和昵称信息
          //   appModel
          //     .login({
          //       code: uni.getStorageSync("wxCode"),
          //       encryptedData: result.detail.encryptedData,
          //       iv: result.detail.iv,
          //     })
          //     .then((response) => {
          //       this.$store.dispatch("setUserInfo", response.data);
          //       uni.setStorageSync("AuthTokens", response.data.token);
          //       uni.setStorageSync("hasUserInfo", true);
          //       this.$emit("onClickBtn");
          //       this.userInfo = result.detail.userInfo;
          //       uni.login({
          //         success(response) {
          //           uni.setStorageSync("wxCode", response.code);
          //         },
          //       });
          //     });
        },
        fail() {
          console.log("失效");
          uni.login({
            success: function(res) {
              if (res.code) {
                uni.setStorageSync("wxCode", res.code);
                const params = {
                  code: res.code,
                };
                // appModel
                //   .login({
                //     code: uni.getStorageSync("wxCode"),
                //     encryptedData: result.detail.encryptedData,
                //     iv: result.detail.iv,
                //   })
                //   .then((response) => {
                //     uni.login({
                //       success(response) {
                //         uni.setStorageSync("wxCode", response.code);
                //       },
                //     });
                //     this.$store.dispatch("setUserInfo", response.data);
                //     uni.setStorageSync("AuthTokens", response.data.token);
                //     uni.setStorageSync("hasUserInfo", true);
                //     this.$emit("onClickBtn");
                //     this.userInfo = result.detail.userInfo;
                //   });
              } else {
                console.log("获取用户登录态失败！" + res.errMsg);
              }
            },
            fail: function() {
              uni.showToast({
                title: "微信登录失败",
                icon: "none",
              });
            },
          });
        },
      });
    },
  },
};
</script>

<style></style>
