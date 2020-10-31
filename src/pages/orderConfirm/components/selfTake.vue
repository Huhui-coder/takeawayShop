<template>
  <div class="content">
    <div class="main">
      <van-cell title="到店时间" :value="mealTime" @click="show = true" />
      <van-popup :show="show" position="bottom">
        <van-datetime-picker
          type="datetime"
          :value="currentDate"
          :min-date="currentDate"
          @cancel="show = false"
          @confirm="confirmTimePick"
        />
      </van-popup>
      <van-divider />
      <div class="p-list">
        <div class="productlist" v-for="(item, index) in product" :key="index">
          <div class="p-name">{{ item.name }}</div>
          <div class="p-money">{{ item.price }}</div>
          <div class="p-num">*{{ item.num }}</div>
        </div>
        <div class="total">
          <div class="text">合计</div>
          <div class="money">￥{{ total }}</div>
        </div>
      </div>
      <van-divider />
      <div class="remake" @click="go('remakeEdit')">
        <van-cell title="备注" is-link :value="remake" />
      </div>
    </div>
    <div class="footer">
      <van-submit-bar
        :loading="loading"
        :disabled="!mealTime"
        :price="total * 100"
        button-text="提交订单"
        @submit="onSubmit"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { order, orderInfo } from "../../../common/api";

import dayjs from "dayjs";

export default {
  data() {
    return {
      show: false,
      minDate: new Date().getTime(),
      maxDate: new Date(2019, 10, 1).getTime(),
      currentDate: new Date().getTime(),
      loading: false,
      userAddressInfo: this.$localStore.get("userAddressInfo"),
      mealTime:dayjs(new Date().getTime()).format("YYYY-MM-DD HH:mm:ss")
    };
  },
  computed: {
    ...mapState({
      isAllSelect: (state) => state.isAllSelect,
      total: (state) => state.total,
      product: (state) => state.product,
      remake: (state) => state.remake,
      orderType: (state) => state.orderType,
      merchantId: (state) => state.merchantId,
    }),
    
  },
  methods: {
    ...mapActions(["setTotal", "setProduct", "setOrderType"]),
    confirmTimePick(val) {
      this.show = false;
      if (val.detail)
        this.mealTime = dayjs(val.detail).format("YYYY-MM-DD HH:mm:ss");
    },
    go(path) {
      uni.navigateTo({
        url: `/pages/orderConfirm/${path}`,
      });
    },
    uuid(len, radix) {
      var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
        ""
      );
      var uuid = [],
        i;
      radix = radix || chars.length;
      for (i = 0; i < len; i++) {
        uuid[i] = chars[0 | (Math.random() * radix)];
      }
      return uuid.join("");
    },
    onSubmit() {
      // 判断时间是否超出一个小时
      this.currentDate = dayjs(this.currentDate).format("YYYY-MM-DD HH:mm:ss");
      let isScheduled = dayjs(this.mealTime).diff(dayjs(this.currentDate),'hour') > 0
      this.loading = true;
      this.setOrderType("selfTake");
      let openid = this.$localStore.get("openid");
      let {
        merchantId,
        remake,
        product,
        orderType,
        total,
        mealTime,
        userAddressInfo
      } = this;
      let that = this;
      // 获取所有的参数
      let orderidUUID = that.uuid(32, 16);
      let nonceStrUUID = that.uuid(32, 16);
      const params = {
        openid,
        merchantId,
        remake,
        product,
        orderType,
        total,
        mealTime,
        isScheduled,
        userAddressInfo,
        orderidUUID
      };
      
      let body = "贝克汉堡订单";
      let money = total * 100;
      // 调用云函数
      wx.cloud.callFunction({
        name: "pay",
        data: {
          body,
          orderid: orderidUUID,
          money,
          nonceStr: nonceStrUUID,
          attach: params
        },
        success: async (res) => {
          await that.pay(res.result)
          let queryResult = await that.queryOrder(orderidUUID, nonceStrUUID)
          that.loading = false
          let orderInfoData = await orderInfo({orderidUUID})
          let orderInfoDataJSON = orderInfoData.data[0]
          console.log('orderInfo', orderInfoDataJSON)
          if (queryResult) {
            uni.navigateTo({
                  url: `/pages/orderResult/success?data=${encodeURIComponent(
                    JSON.stringify(orderInfoDataJSON)
                  )}`,
                });
          } else {
            that.$toast("支付失败");
            uni.navigateTo({
              url: "/pages/orderResult/fail",
            });
          }
        },
        fail: (err) => {
          console.error("[云函数] [login] 调用失败", err);
        },
      });
    },
    pay(payData) {
      //实现小程序支付
      var that = this;
      const payment = payData.payment; //这里注意，上一个函数的result中直接整合了这里要用的参数，直接展开即可使用
      return new Promise((resolve, reject) => {
        wx.requestPayment({
          ...payment, //。。。是展开变量的语法
          success(res) {
            resolve(true);
          },
          fail(res) {
            //跳转到支付失败页面
            resolve(false);
          },
        });
      });
    },
    queryOrder(id, str) {
      return new Promise((resolve, reject) => {
        wx.cloud.callFunction({
          name: "query_order",
          data: {
            orderid: id,
            nonceStr: str,
          },
          success: (res) => {
            if (res.result.tradeState === 'SUCCESS') {
            resolve(true);
            }
          },
          fail: (err) => {
            console.error("[云函数] [quer_order] 调用失败", err);
            resolve(false);
          },
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  position: relative;
  width: 90vw;
  margin: 0 auto;
  height: 100vh;
  padding-top: 30upx;

  .main {
    button {
      margin: 20upx 0;
      line-height: 1;
      .area,
      .p-list,
      .remake {
        padding: 10upx;
        margin: 40upx 0;
      }
      .area {
        background-color: #f5efef;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;

        .area-text {
        }
        .area-address {
          font-size: 13px;
        }
        .person {
          .name {
          }
          .phone {
          }
        }
      }
    }

    .p-list {
      .productlist,
      .total {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .total {
        justify-content: space-between;
      }
    }
    .remake {
    }
  }
  .footer {
    position: relative;
  }
}
</style>
