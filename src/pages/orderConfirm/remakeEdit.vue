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
    <van-button type="danger" size="large" @click="submit">确认</van-button>
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
  onLoad() {
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
  .nav {
    padding-top: 20upx;
  }
  .main {
    width: 80vw;
    margin: 0 auto;
    .address-wrap {
    }
  }
}
</style>
