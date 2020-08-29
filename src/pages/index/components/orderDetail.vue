<template>
  <div class="container">
    <div class="info">
      {{ infoFormat(orderData.status) }}
      <div class="merchantInfo">
        <span>店铺：{{ merchantInfo.shopName }}</span>
        商家电话：
        <span @click="phone(merchantInfo.merchantPhone)">{{
          merchantInfo.merchantPhone
        }}</span>
      </div>
    </div>
    <div class="order-info">
      <div class="numbering">
        <span class="text">
          订单编号:
          {{ orderData.numbering }}
        </span>
        <van-tag color="#f2826a" plain>{{
              orderTypeInfo(orderData.orderType)
            }}</van-tag>
      </div>
      <div class="addressInfo" v-if="orderData.orderType === 'takeAway'">
        <p>收货地址</p>
        <p v-html="addressFormat(orderData.userAddressInfo)"></p>
      </div>
      <div class="addressInfo" v-if="!orderData.orderType === 'dine'">
        <p>取餐时间</p>
        <p>{{ orderData.mealTime }}</p>
      </div>

      <div class="productInfo">
        <p>共{{ orderData.product.length }}件商品</p>
        <div class="p-wrap" v-for="item in orderData.product" :key="item._id">
          <div class="name">{{ item.name }}</div>
          <div class="num">x{{ item.num }}</div>
          <div class="price">￥{{ item.price }}</div>
        </div>
        <van-divider />
        <p class="total">
          总计:<span class="moeny"> {{ orderData.total }}</span>
        </p>
      </div>
      <div class="orderInfo">
        <p>订单详情</p>
        <div>
          <span class="gray-text">订单编号</span>
          <span>{{ orderData._id }}</span>
        </div>
        <div>
          <span class="gray-text">订单时间</span>
          <span>{{ formatTime(orderData.create_time) }}</span>
        </div>
      </div>
    </div>
    <loading/>
  </div>
</template>

<script>
import { singleOrder } from "../../../common/api";

export default {
  data() {
    return {
      id: "",
      orderData: {},
      merchantInfo: {},
    };
  },
  onLoad(option) {
    let data = option.id;
    this.id = data;
    let that = this;
        singleOrder({ _id: this.id }).then((res) => {
      if (res.code === 0) {
        that.orderData = res.data;
        that.merchantInfo = res.merchantInfo;
      }
    }); 
  },
  methods: {
    orderTypeInfo(data) {
      let mapper = {
        takeAway: "外送",
        selfTake: "自提",
        dine: "堂食",
      };
      return mapper[data];
    },
    phone(tel) {
      uni.makePhoneCall({
        phoneNumber: tel,
      });
    },
    infoFormat(status) {
      let mapper = {
        ordered: "您已成功下单，待商家确认",
        receiving: "商家已出餐,请到指定地点取餐",
        complete: "订单已完成",
      };
      return mapper[status];
    },
    addressFormat(data) {
      if (data) {
        return `<p>${data.provinceName}${data.cityName}${data.countyName}${data.detailInfo}</p>
        <p>${data.userName} ${data.telNumber}</p>
        `;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  background-color: rgb(245, 246, 247);
  min-height: 100vh;
  .info {
    background-color: #ff6600;
    color: white;
    padding: 40upx;
    font-size: 14px;
    .merchantInfo {
      width: 80vw;
      margin: 20upx auto 0 auto;
      padding: 20upx;
      background-color: #b84b02;
      & > span:nth-of-type(1) {
        margin-right: 20upx;
      }
      & > span:nth-of-type(2) {
        color: rgb(72, 72, 247);
      }
    }
  }
  .order-info {
    font-size: 12px;
    div p:nth-of-type(1) {
      font-size: 14px;
      font-weight: bolder;
      margin: 20upx 0;
    }
    .numbering,
    .addressInfo,
    .productInfo,
    .orderInfo {
      padding: 40upx;
      background-color: white;
      margin: 20upx 0;
    }
    .numbering {
      .text {
        margin-right: 20upx;
      }
    }
    .addressInfo {
    }
    .productInfo {
      .p-wrap {
        display: flex;
        justify-content: space-between;
        .price {
          color: black;
        }
        .num,
        .name {
          color: #999aaa;
        }
      }
      .total {
        text-align: right;
        .moeny {
          color: red;
        }
      }
    }
    .orderInfo {
      .gray-text {
        color: #999aaa;
      }
    }
  }
}
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  width: 24px;
  height: 24px;
}
</style>
