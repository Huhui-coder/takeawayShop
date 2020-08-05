<template>
  <div class="content">
    <div class="main">
      <van-cell title="选择时间" :value="mealTime" @click="show = true" />
      <van-popup
        :show="show"
        position="bottom"
      >
        <van-datetime-picker
          type="datetime"
          :value="currentDate"
          @cancel="show = false;"
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
import dayjs from 'dayjs'

export default {
  data() {
    return {
      show: false,
      minDate: new Date().getTime(),
      maxDate: new Date(2019, 10, 1).getTime(),
      currentDate: new Date().getTime(),
      loading: false,
      mealTime: "",
      userAddressInfo: this.$localStore.get("userAddressInfo")
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
    confirmTimePick (val) {
        this.show = false
        if (val.detail) this.mealTime = dayjs(val.detail).format('YYYY-MM-DD HH:mm')
      },
    go(path) {
      uni.navigateTo({
        url: `/pages/orderConfirm/${path}`,
      });
    },
    onSubmit() {
      this.loading = true;
      this.setOrderType("selfTake");
      let openid = this.$localStore.get("openid");
      let { merchantId, remake, product, orderType, total, mealTime, userAddressInfo } = this;
      let that = this;
      // 获取所有的参数
      const params = {
        openid,
        merchantId,
        remake,
        product,
        orderType,
        userAddressInfo,
        total,
        mealTime
      };
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
