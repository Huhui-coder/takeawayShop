<template>
  <div class="content">
    <div class="main">
      <button type="default" @click="getUserLocatin">
        <div class="area">
          <div class="area-text">收货地址:</div>
          <div class="area-address">
            <div v-if="Object.keys(userAddressInfo).length > 1">
              <p>
                {{ userAddressInfo.cityName }} {{ userAddressInfo.countyName }}
                {{ userAddressInfo.detailInfo }}
              </p>
              <p>
                <span class="name">{{ userAddressInfo.userName }}</span
                >||
                <span class="phone">{{ userAddressInfo.telNumber }}</span>
              </p>
            </div>
            <div v-else>
              暂无地址请先选择
            </div>
          </div>
          <van-icon name="plus" />
        </div>
      </button>
      <van-divider />
      <van-cell title="送达时间" :value="mealTime" @click="show = true" />
      <van-popup :show="show" position="bottom">
        <van-datetime-picker
          type="datetime"
          :value="currentDate"
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
        :disabled="!isNotNulluserAddressInfo"
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
import dayjs from "dayjs";


export default {
  data() {
    return {
      show: false,
      loading: false,
      currentDate: new Date().getTime(),
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
    isNotNulluserAddressInfo(){
      return Object.keys(this.userAddressInfo).length > 0
    }
  },
  methods: {
    ...mapActions(["setTotal", "setProduct", "setOrderType"]),
    go(path) {
      uni.navigateTo({
        url: `/pages/orderConfirm/${path}`,
      });
      console.log(1);
    },
    confirmTimePick(val) {
      this.show = false;
      if (val.detail)
        this.mealTime = dayjs(val.detail).format("YYYY-MM-DD HH:mm:ss");
    },
    getUserLocatin() {
      let that = this;
      wx.getSetting({
        success(res) {
          console.log(
            "vres.authSetting['scope.address']：",
            res.authSetting["scope.address"]
          );
          if (res.authSetting["scope.address"]) {
            console.log("111");
            wx.chooseAddress({
              success(res) {
                let params = {
                  userName: res.userName,
                  provinceName: res.provinceName,
                  cityName: res.cityName,
                  countyName: res.countyName,
                  detailInfo: res.detailInfo,
                  telNumber: res.telNumber,
                };
                  that.$localStore.set("userAddressInfo", params);
                  that.userAddressInfo = that.$localStore.get(
                    "userAddressInfo"
                  );
              },
              fail(e) {
                console.log(e);
                that.$toast("您取消了地址位置授权，请选择确定");
              },
            });
          } else {
            if (res.authSetting["scope.address"] == false) {
              console.log("222");
              wx.openSetting({
                success(res) {
                  console.log(res.authSetting);
                },
              });
            } else {
              // 第一次打开小程序
              console.log("eee");
              wx.chooseAddress({
                success(res) {
                  let params = {
                    userName: res.userName,
                    provinceName: res.provinceName,
                    cityName: res.cityName,
                    countyName: res.countyName,
                    detailInfo: res.detailInfo,
                    telNumber: res.telNumber,
                  };

                  if (res.provinceName === res.cityName) {
                    delete params.provinceName;
                    that.$localStore.set("userAddressInfo", params);
                    that.userAddressInfo = that.$localStore.get(
                    "userAddressInfo"
                  );
                  } else {
                    that.$localStore.set("userAddressInfo", params);
                    that.userAddressInfo = that.$localStore.get(
                    "userAddressInfo"
                  );
                  }
                },
                fail(e) {
                  that.$toast("您取消了地址位置授权，请选择确定");
                },
              });
            }
          }
        },
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
      console.log('isScheduled', isScheduled)
      this.loading = true;
      this.setOrderType("takeAway");
      let openid = this.$localStore.get("openid");
      let {
        merchantId,
        userAddressInfo,
        remake,
        product,
        orderType,
        total,
        mealTime
      } = this;
      let that = this;
      // 获取所有的参数
      const params = {
        openid,
        merchantId,
        userAddressInfo,
        remake,
        product,
        orderType,
        total,
        mealTime,
        isScheduled
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
