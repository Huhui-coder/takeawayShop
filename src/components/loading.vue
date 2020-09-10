<template>
    <view class="wrapper" v-show="loading">
      <view class="block">
        <van-loading size="24px" type="spinner" vertical color="#1989fa">
          加载中
        </van-loading>
      </view>
    </view>
</template>

<script>

export default {
  props:['loading'],
  data() {
    return {
    };
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
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
