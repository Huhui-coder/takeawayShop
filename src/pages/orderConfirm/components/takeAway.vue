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
      <div class="p-list">
        <div class="productlist" v-for="(item, index) in product" :key="index">
          <div class="p-name">{{ item.name }}</div>
          <div class="p-money">{{ item.price }}</div>
          <div class="p-num">*{{ item.num }}</div>
        </div>
        <div class="total">
          <div class="text">合计</div>
          <div class="money">￥{{ total / 100 }}</div>
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
        :price="total"
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
      loading: false,
      userAddressInfo: this.$localStore.get("userAddressInfo"),
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
                  } else {
                    that.$localStore.set("userAddressInfo", params);
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
    onSubmit() {
      this.loading = true
      this.setOrderType("takeAway");
      let openid = this.$localStore.get("openid");
      let { merchantId, userAddressInfo, remake, product, orderType, total } = this;
      let that = this
      // 获取所有的参数
      const params = {
        openid,
        merchantId,
        userAddressInfo,
        remake,
        product,
        orderType,
        total
      };
      order(params).then((res) => {
        console.log(res);
        that.loading = false
        if (res.code === 0) {
          uni.navigateTo({
            url: `/pages/orderResult/success?data=${encodeURIComponent(JSON.stringify(res.data))}`,
          });
        } else {
          uni.navigateTo({
            url: "/pages/orderResult/fail",
          });
        }
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
