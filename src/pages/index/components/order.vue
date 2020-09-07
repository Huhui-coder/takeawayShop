<template>
  <div class="content">
    <div class="main">
      <van-tree-select
        class="main-item"
        :main-active-index="mainActiveIndex"
        :items="items"
        height="77vh"
        @click-nav="onClickNav"
        @click-item="onClickItem"
      >
        <productList slot="content" :items="currentItems" ref="productList" :mainCur="mainCur" @scroll-update="scrollUpdate"/>
      </van-tree-select>
    </div>
    <div class="footer">
      <van-submit-bar
        :price="total * 100"
        button-text="提交订单"
        :disabled="total === 0 || total < merchantInfo.limitPrice"
        @submit="onSubmit"
        custom-class="van-submit-bar"
      >
        <view>
          <van-goods-action-icon
            icon="cart-o"
            text="购物车"
            :info="Number(product.length)"
            @click="onClickCart"
          />
        </view>
        <view slot="tip">起送价为￥{{merchantInfo.limitPrice}}(免配送费)</view>
      </van-submit-bar>
      <div class="cart-wrap" :class="[showCart ? 'show' : 'hidden']">
        <div class="content-wrap">
          <div class="title">已选购商品</div>
          <div class="action" @click="emptyCart">清空</div>
        </div>
        <template v-if="product.length > 0">
          <div class="p-wrap" v-for="item in product" :key="item._id">
            <div class="p-name">{{ item.name }}</div>
            <div class="p-num">{{ item.num }}</div>
          </div>
        </template>
        <template v-else>
          <div style="text-align:center">
            暂无商品
          </div>
        </template>
      </div>
    </div>
    <van-overlay :show="showCart" @click="onClickHide" />
  </div>
</template>

<script>
import productList from "./product-list";
import { mapState, mapActions } from "vuex";

export default {
  components: { productList },
  props: {
    items: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {
      mainActiveIndex: 0,
      currentItems: [],
      showCart: false,
      mainCur: 0
    };
  },
  watch: {
    items: {
      handler: function(value) {
        let newArray = [];
        value.map((item) => item.children);
        this.currentItems = value;
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    ...mapState({
      isAllSelect: (state) => state.isAllSelect,
      total: (state) => state.total,
      product: (state) => state.product,
      merchantInfo: (state) => state.merchantInfo,
    }),
  },
  mounted() {},
  methods: {
    ...mapActions(["setIsAllSelect", "setProduct", "setTotal"]),
    scrollUpdate(v){
      this.mainActiveIndex = v 
    },
    onClickHide() {
      this.showCart = false;
    },
    // 当点击右侧分类导航时，选择对应的商品进行展示
    onClickNav({ detail = {} }) {
      let index = detail.index;
      let { items } = this;
      this.mainCur = 'item_' + detail.index
    },
    onClickItem({ detail = {} }){
      console.log(detail)
    },
    emptyCart() {
      this.setProduct([]);
      this.setTotal(0);
      this.$refs.productList.emptyAllProduct()
    },
    onClickCart() {
      // this.showCart = !this.showCart;
      this.showCart = false
    },
    onAllSelect(value) {
      this.setIsAllSelect(value.detail);
      if (this.isAllSelect) {
        this.$refs.productList.productList.map((item) =>
          item.children.map((p) => (p.checked = true))
        );
      } else {
        this.$refs.productList.productList.map((item) =>
          item.children.map((p) => (p.checked = false))
        );
      }
    },
    onSubmit() {
      uni.navigateTo({
        url: "/pages/orderConfirm/index",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  position: relative;
  height: 100%;
  .main {
    padding-bottom: 60upx;
  }
  .footer {
    position: relative;

    .cart-wrap {
      position: absolute;
      left: 0;
      width: 100vw;
      background: rgb(255, 255, 255);
      z-index: 2;
      bottom: 0;
      .content-wrap {
        display: flex;
        justify-content: space-between;
        padding: 25upx;
        .title {
          font-size: 14px;
        }
        .action {
          font-size: 12px;
        }
      }
      .p-wrap {
        display: flex;
        justify-content: space-around;
      }
    }
    .show {
      min-height: 10vh;
    }
    .hidden {
      visibility: hidden;
    }
  }
}
</style>
