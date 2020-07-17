<script>
export default {
  onLaunch: function() {
    console.log("App Launch");
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
