<script>
export default {
  onLaunch: function() {
    console.log("App Launch");
    wx.cloud.init({
      // env: "test-k78d2", // 测试环境
      env: "pro-wir1p", // 正式环境
    });
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  },
};
</script>

<style>
@import "./wxcomponents/vant/dist/common/index.wxss";
/*每个页面公共css */
.van-submit-bar {
  position: relative;
}
[v-cloak] {
  display: none !important;
}
</style>
