<template>
  <div class="content">
    <div class="main">
      <div class="area">
        <div class="area-text">收货地址:</div>
        <div class="area-address" @click="go('addressList')">
          <p>重庆市渝北区九寨印象</p>
          <p>
            <span class="name">huhui</span>
            <span class="phone">15330367593</span>
          </p>
        </div>
        <van-icon name="plus" />
      </div>
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
        :price="total"
        button-text="提交订单"
        @submit="onSubmit"
      />
    </div>
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
      isAllSelect: (state) => state.isAllSelect,
      total: (state) => state.total,
      product: (state) => state.product,
      remake: (state) => state.remake
    }),
  },
  methods: {
    ...mapActions(["setTotal", "setProduct"]),
    go(path) {
      uni.navigateTo({
        url: `/pages/orderConfirm/${path}`,
      });
      console.log(1);
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  position: relative;
  width: 80%;
  margin: 0 auto;
  .main {
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
      .area-text {
      }
      .area-address {
      }
      .person {
        .name {
        }
        .phone {
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
