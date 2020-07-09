<template>
  <div class="content">
    <div class="product-wrap">
      <div class="list" v-for="item in productList" :key="item.id">
        <van-checkbox
          :value="item.checked"
          :id="item.id"
          @change="checkBoxChange"
        />
        <div class="left">
          <div class="img">
            <img :src="item.url" alt="" />
          </div>
        </div>
        <div class="right">
          <div class="text">
            <p>{{ item.name }}</p>
            <p>{{ item.desc }}</p>
            <p>{{ item.price }}</p>
          </div>
          <div class="step">
            <van-stepper
              :id="item.id"
              :value="item.num"
              @change="onChange"
              min="1"
              max="99"
              integer
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      itemsList: [],
      productList: [],
      currentId: 0,
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    ...mapState({
      isAllSelect: (state) => state.isAllSelect,
      total: (state) => state.total,
      product: (state) => state.product,
    }),
  },
  watch: {
    productList: {
      handler(value) {
        // 找到已选择的商品,计算它的价格，然后 累计
        let product = value;
        let total = 0;
        let chooseProduct = [];
        for (let item of product) {
          if (item.checked) {
            chooseProduct.push(item);
            total += item.num * item.price;
          }
          this.setProduct(chooseProduct);
          this.setTotal(total);
        }
        console.log(this.product);
      },
      deep: true,
      immediate: true,
    },
    items: {
      handler(value) {
        this.productList = value;
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    ...mapActions(["setTotal", "setProduct"]),
    init() {
      this.productList = this.items;
    },
    fetch() {
      console.log(1);
    },
    checkBoxChange(value) {
      let id = value.currentTarget.id;
      let { productList } = this;
      for (let item of productList) {
        if (item.id == id) {
          item.checked = !item.checked;
        }
      }
    },
    onChange(value) {
      let id = value.currentTarget.id;
      let detail = value.detail;
      let { productList } = this;
      for (let item of productList) {
        if (item.id == id) {
          item.num = detail;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  .product-wrap {
    background-color: #f1f0f0;
    .list {
      display: flex;
      align-items: center;
      margin: 5px 0;
      background-color: white;
      .left {
        .img {
          width: 250upx;
          height: 150upx;
        }
        img {
          width: 250upx;
          height: 150upx;
        }
      }
      .right {
        flex: 1;
        .text {
        }
        .step {
        }
      }
    }
  }
}
</style>
