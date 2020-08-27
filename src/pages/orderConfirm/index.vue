<template>
  <div class="content">
    <div class="tabs">
      <van-tabs type="card">
        <van-tab title="外送服务">
          <take-away />
        </van-tab>
        <van-tab title="到店自提">
          <self-take />
        </van-tab>
         <van-tab title="堂食">
          <dine />
        </van-tab>
      </van-tabs>
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
    return {};
  },
};
</script>

<style lang="scss" scoped>
.content {
  .tabs {
    padding: 30upx 0;
  }
}
</style>
