<template>
  <div class="content">
    <div class="main">
      <div class="address-wrap">
        <div class="address-list" v-for="(item, index) in address" :key="index">
          <div class="name">
            <span>{{ item.name }}</span> <span>{{ item.phone }}</span>
          </div>
          <div class="address">{{ item.address }}</div>
          <div class="detail">{{ item.detail }}</div>
          <div class="btn">
            <van-button
              color="linear-gradient(to right, #4bb0ff, #6149f6)"
              size="small"
              @click="toEdit(item)"
            >
              编辑
            </van-button>
            <van-button
              color="linear-gradient(to left, #4bb0ff, #6149f6)"
              size="small"
              @click="onDefault(item)"
            >
              设为默认地址
            </van-button>
          </div>
          <div class="defalut" v-if="item.default">
            <img src="./images/choosed.png" alt="" />
          </div>
          <van-divider />
        </div>
      </div>
    </div>
    <van-button type="danger" size="large" @click="onClickRight"
      >新增收货地址</van-button
    >
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState({
      address: (state) => state.address,
    }),
  },
  methods: {
    // 用户地址的一系列操作要放到服务端去做
    ...mapActions(["setAddress"]),
    onDefault() {},
    onClickLeft() {
      uni.navigateBack({
        delta: 1,
      });
    },
    onClickRight() {
      console.log(123);
      uni.navigateTo({
        url: "/pages/orderConfirm/addressEdit",
      });
    },
    toEdit(item) {
      uni.navigateTo({
        url: `/pages/orderConfirm/addressEdit?address=${encodeURIComponent(
          JSON.stringify(item)
        )}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  .nav {
  }
  .main {
    width: 80vw;
    margin: 0 auto;
    .address-wrap {
      .address-list {
        position: relative;
        .name {
          font-size: 18px;
          font-weight: bolder;
          color: black;
        }
        .address {
          font-size: 15px;
          font-weight: bold;
          color: gray;
        }
        .detail {
          font-size: 13px;
          font-weight: bold;
          color: gray;
        }
        .btn {
          display: flex;
          justify-content: space-around;
        }
        .defalut {
          position: absolute;
          right: 0;
          top: 0;
          img {
            width: 100upx;
            height: 100upx;
          }
        }
      }
    }
  }
}
</style>
