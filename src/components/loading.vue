<template>
    <view class="wrapper" v-if="showLoading">
      <view class="block">
        <van-loading size="24px" type="spinner" vertical>
          加载中 {{showLoading}}
        </van-loading>
      </view>
    </view>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
    };
  },
  computed:{
    ...mapState({
      showLoading: (state) => state.showLoading,
    }),
  }
};
</script>

<style>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  z-index: 999;
  position: absolute;
 left: 0;
 top: 0;
  background-color: #fff;
}

.block {
  width: 124px;
  height: 124px;
  background-color: #fff;
  text-align: center;
}
</style>
