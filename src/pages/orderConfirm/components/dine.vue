<template>
  <div class="content">
    <div class="main">
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
        :price="total * 100"
        button-text="提交订单"
        @submit="onSubmit"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { order } from "../../../common/api";

export default {
  data() {
    return {
      loading: false
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
    go(path) {
      uni.navigateTo({
        url: `/pages/orderConfirm/${path}`,
      });
      console.log(1);
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
      this.loading = true;
      this.setOrderType("dine");
      let openid = this.$localStore.get("openid");
      let {
        merchantId,
        remake,
        product,
        orderType,
        total,
      } = this;
      let that = this;
      // 获取所有的参数
      const params = {
        openid,
        merchantId,
        remake,
        product,
        orderType,
        total,
      };
      let orderidUUID = that.uuid(32, 16);
      let nonceStrUUID = that.uuid(32, 16);
      console.log("uuid", orderidUUID);
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
        },
        success: async (res) => {
          console.log("pay云函数调用成功", res);
          let payResult = await that.pay(res.result);
          if (payResult) {
            console.log("支付成功的回调");
            order(params).then((res) => {
              console.log(res);
              that.loading = false;
              if (res.code === 0) {
                uni.navigateTo({
                  url: `/pages/orderResult/success?data=${encodeURIComponent(
                    JSON.stringify(res.data)
                  )}`,
                });
              } else {
                uni.navigateTo({
                  url: "/pages/orderResult/fail",
                });
              }
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
            console.log("pay success", res);
            //跳转到支付成功页面
            resolve(true);
          },
          fail(res) {
            console.error("pay fail", res);
            //跳转到支付失败页面
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
    position: fixed;
    left: 0;
    bottom: 0;
  }
}
</style>
