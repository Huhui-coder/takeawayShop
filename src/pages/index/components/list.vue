<template>
  <div class="container">
    <div class="list-wrap">
      <div
        class="list"
        v-for="item in orderList"
        :key="item._id"
        @click="goOrderDetail(item._id)"
      >
        <div class="header">
          <div class="numbering">
            {{ item.numbering }}
            <van-tag color="#f2826a" plain>{{
              orderTypeInfo(item.orderType)
            }}</van-tag>
          </div>
          <div class="status">
            <span>{{ statusInfo(item.status) }}</span>
          </div>
        </div>
        <div class="content">
          {{ productInfo(item.product) }}
        </div>
        <div class="footer">
          <div class="time">
            {{ formatTime(item.create_time) }}
          </div>
          <div class="info">
            共{{ item.product.length }}件商品 合计
            <span class="money"> ￥{{ item.total }} </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { allOrder } from "../../../common/api";

export default {
  data() {
    return {
      orderList: []
    }
  },
  mounted(){
    this.fetch()
  },
  methods: {
    fetch() {
      let openid = this.$localStore.get("openid");
      let that = this;
      allOrder({ openid }).then((res) => {
        that.orderList = res.data;
      });
    },
    statusInfo(data) {
      let mapper = {
        ordered: "用户已下单",
        receiving: "商家已确认",
        complete: "订单已完成",
      };
      return mapper[data];
    },
    orderTypeInfo(data) {
      let mapper = {
        takeAway: "外送",
        selfTake: "自提",
        dine: "堂食",
      };
      return mapper[data];
    },
    productInfo(data) {
      let array = [];
      data.map((item) => array.push(item.name));
      return array.join("/");
    },
    goOrderDetail(id) {
      uni.navigateTo({
        url: `/pages/index/components/orderDetail?id=${id}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  margin: 0 auto;
  background-color: rgb(245, 246, 247);
  font-size: 13px;
  min-height: 100vh;
  .list-wrap {
    .list {
      width: 90vw;
      display: flex;
      flex-direction: column;
      background-color: white;
      margin: 20upx auto;
      border: 1px solid #fff;
      border-radius: 10upx;
      padding: 20upx;

      .header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .numbering {
        }
        .status {
        }
      }
      .content {
        background-color: rgb(245, 246, 247);
        padding: 40upx 20upx;
        margin: 20upx 0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .footer {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-size: 12px;
        color: #999aaa;
        .time {
        }
        .info {
          .money {
            color: #000;
          }
        }
      }
    }
  }
}
</style>
