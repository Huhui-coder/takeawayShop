<template>
  <div class="container">
    <div class="tip">
      <van-icon name="warning-o" color="red" size="50px" />
      <p>下单失败</p>
    </div>
    <div class="btn">
      <van-button plain type="info" @click="goPage('home')"
        >回到首页</van-button
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    goPage(page, id) {
      if (page === "home") {
        uni.navigateTo({
          url: "/pages/index/index",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  .tip {
    margin: 30upx;
    text-align: center;
  }
  .btn {
  }
}
</style>
