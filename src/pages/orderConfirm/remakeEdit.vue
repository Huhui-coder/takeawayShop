<template>
  <div class="content">
    <div class="main">
      <div class="address-wrap">
        <van-field
          :value="myRemake"
          label="备注"
          type="textarea"
          placeholder="请输入备注"
          autosize
          maxlength="100"
          show-word-limit
          @change="changeFiled($event)"
        />
      </div>
    </div>
    <van-button type="danger" size="large" @click="submit" class="submit-button">确认</van-button>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Toast from "../../wxcomponents/vant/dist/toast/toast";
import AreaList from "./area";

export default {
  data() {
    return {
      myRemake: ''
    };
  },
  mounted() {
    this.myRemake = this.remake
  },
  computed: {
    ...mapState({
      remake: (state) => state.remake,
    }),
  },
  methods: {
    ...mapActions(["setRemake"]),
    changeFiled(e) {
      console.log(e)
      this.myRemake = e.detail
    },
    onClickLeft() {
      uni.navigateBack({
        delta: 1,
      });
    },
    submit() {
      this.setRemake(this.myRemake)
      uni.navigateBack({
        delta: 1,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  position: relative;
  height: 100vh;
  .nav {
    padding-top: 20upx;
  }
  .main {
    width: 90vw;
    margin: 0 auto;
    .address-wrap {
    }
  }
  .submit-button{
  position: absolute;
  left: 0;
  bottom: 30upx;
  width: 100vw;
  }
}
</style>
