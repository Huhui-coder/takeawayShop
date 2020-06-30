<template>
  <view class="content">
    <view class="merchant-wrap">
      <view class="desc">
        <view class="name">何王氏传</view>
        <view class="support"
          >本店支持
          <van-tag type="primary">门店自提</van-tag>
          <van-tag type="success">外卖配送</van-tag>
        </view>
      </view>
    </view>
    <view class="tab-wrap">
      <van-tabs active="order" animated sticky swipeable class="vanTabs">
        <van-tab title="下单" name="order" class="vanTab">
          <order class="order" />
        </van-tab>
        <van-tab title="我的订单" name="list" class="vanTab">
          <list />
        </van-tab>
      </van-tabs>
    </view>
  </view>
</template>

<script>
import { login } from "../../common/api";
import order from "./components/order";
import list from "./components/list";

export default {
  components: {
    order,
    list,
  },
  data() {
    return {};
  },
  onLoad() {},
  methods: {
    login() {
      login(params, captChaCookie).then((res) => {
        console.log(res);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  .merchant-wrap {
    background-color: #ff6600;
    color: white;
    padding: 20upx;
    .desc {
    }
  }
  .tab-wrap {
  }
}
.vanTabs {
}
.vanTab {
  min-height: calc(100vh - 220upx);
}
.order {
  min-height: calc(100vh - 220upx);
}
</style>
