<template>
  <div class="container">
    <div class="tip">
    <van-icon name="certificate" color="green" size="50px"/>
    <p>下单成功</p>
    <p>订单号:{{productInfo.numbering}}</p>
    </div>
    <div class="btn">
    <van-button plain type="primary" @click="goPage('detail', productInfo._id)"
      >查看订单详情</van-button
    >
    <van-button plain type="info" @click="goPage('home')">回到首页</van-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      productInfo: {},
    };
  },
  onLoad(option) {
    let data = JSON.parse(decodeURIComponent(option.data));
    this.productInfo = data;
  },
  methods: {
    goPage(page, id) {
      if (page === "home") {
        uni.navigateTo({
          url: "/pages/index/index",
        });
      } else {
        uni.navigateTo({
          url: `/pages/index/components/orderDetail?id=${id}`,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  .tip{
    margin: 30upx;
    text-align: center;
  }
  .btn{}
}
</style>
