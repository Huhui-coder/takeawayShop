<template>
  <div class="content">
    <div class="main">
      <van-tree-select
        class="main-item"
        :main-active-index="mainActiveIndex"
        :items="items"
        height="80vh"
        @click-nav="onClickNav"
        @click-item="onClickItem"
      >
        <productList slot="content" :items="currentItems" ref="productList" />
      </van-tree-select>
    </div>
    <div class="footer">
      <van-submit-bar
        :price="total"
        button-text="提交订单"
        @submit="onSubmit"
        custom-class="van-submit-bar"
      >
        <view
          ><van-checkbox :value="isAllSelect" @change="onAllSelect">{{
            isAllSelect ? "全不选" : "全选"
          }}</van-checkbox></view
        >
      </van-submit-bar>
    </div>
  </div>
</template>

<script>
import productList from "./product-list";
import { mapState, mapActions } from "vuex";

export default {
  components: { productList },
  data() {
    return {
      mainActiveIndex: 0,
      currentItems: [],
      items: [
        {
          text: "日结",
          children: [
            {
              url: "https://img.yzcdn.cn/vant/apple-1.jpg",
              name: "小吃3",
              price: 22,
              desc: "好好吃",
              id: 6,
              checked: false,
              num: 1,
            },
            {
              url: "https://img.yzcdn.cn/vant/apple-1.jpg",
              name: "小吃2",
              price: 22,
              desc: "好好吃",
              id: 5,
              checked: false,
              num: 1,
            },
            {
              url: "https://img.yzcdn.cn/vant/apple-1.jpg",
              name: "小吃1",
              price: 22,
              desc: "好好吃",
              id: 4,
              checked: false,
              num: 1,
            },
          ],
        },
        {
          text: "周结",
          children: [
            {
              url: "https://img.yzcdn.cn/vant/apple-1.jpg",
              name: "小吃3",
              price: 22,
              desc: "胡辉",
              id: 3,
              checked: false,
              num: 1,
            },
            {
              url: "https://img.yzcdn.cn/vant/apple-1.jpg",
              name: "小吃3",
              price: 22,
              desc: "胡辉",
              id: 3,
              checked: false,
              num: 1,
            },
            {
              url: "https://img.yzcdn.cn/vant/apple-1.jpg",
              name: "小吃3",
              price: 22,
              desc: "胡辉",
              id: 3,
              checked: false,
              num: 1,
            },
            {
              url: "https://img.yzcdn.cn/vant/apple-1.jpg",
              name: "小吃3",
              price: 22,
              desc: "胡辉",
              id: 3,
              checked: false,
              num: 1,
            },
            {
              url: "https://img.yzcdn.cn/vant/apple-1.jpg",
              name: "小吃3",
              price: 22,
              desc: "胡辉",
              id: 3,
              checked: false,
              num: 1,
            },
            {
              url: "https://img.yzcdn.cn/vant/apple-1.jpg",
              name: "小吃2",
              price: 22,
              desc: "胡辉",
              id: 2,
              checked: false,
              num: 1,
            },
            {
              url: "https://img.yzcdn.cn/vant/apple-1.jpg",
              name: "小吃1",
              price: 22,
              desc: "胡辉",
              id: 1,
              checked: false,
              num: 1,
            },
          ],
        },
      ],
    };
  },
  computed: {
    ...mapState({
      isAllSelect: (state) => state.isAllSelect,
      total: (state) => state.total, // 基本单位是分，转化为元
      product: (state) => state.product,
    }),
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions(["setIsAllSelect"]),
    init() {
      this.currentItems = this.items[0].children;
    },
    // 当点击右侧分类导航时，选择对应的商品进行展示
    onClickNav({ detail = {} }) {
      let index = detail.index;
      let { items } = this;
      this.currentItems = this.items[index].children;
    },

    onClickItem({ detail = {} }) {
      console.log(detail);
    },
    onAllSelect(value) {
      this.setIsAllSelect(value.detail);
      if (this.isAllSelect) {
        this.$refs.productList.productList.map((item) => (item.checked = true));
      } else {
        this.$refs.productList.productList.map(
          (item) => (item.checked = false)
        );
      }
      console.log(value);
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
  .main {
  }
  .footer {
    .van-submit-bar {
      padding-top: 50upx;
    }
  }
}
.main-item {
  min-height: calc(100vh + 50upx);
  .van-tree-select {
    min-height: calc(100vh + 50upx) !important;
  }
}
</style>
