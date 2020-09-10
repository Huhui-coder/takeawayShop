<template>
<div>
  <loading :loading="show"/>
  <div class="content" v-if="!show">
    <div class="tabs">
      <van-tabs type="card" tab-class="tab-content">
        <van-tab title="外送服务" class="tab-content">
          <take-away />
        </van-tab>
        <van-tab title="到店自提" class="tab-content">
          <self-take />
        </van-tab>
         <van-tab title="堂食" class="tab-content">
          <dine />
        </van-tab>
      </van-tabs>
    </div>
  </div>
  </div>
</template>

<script>
import selfTake from "./components/selfTake";
import takeAway from "./components/takeAway";
import dine from "./components/dine";
export default {
  components: {
    selfTake,
    takeAway,
    dine
  },
  data() {
    return {
      show: true,
    };
  },
  mounted() {
    this.show = false
  }
};
</script>

<style lang="scss" scoped>
.content {
  height: 100vh;
  .tabs {
    padding: 30upx 0;
    height: 100vh;
    .tab-content{
    height: 100vh;
    }
  }
}
</style>
