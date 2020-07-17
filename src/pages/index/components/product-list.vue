<template>
  <div class="content">
    <div class="product-wrap">
      <div class="list-wrap" v-for="(item, index) in productList" :key="index">
        <p class="type-name">{{ item.text }}</p>
        <div class="list" v-for="p in item.children" :key="p._id">
          <van-checkbox
            :value="p.checked"
            :id="p._id"
            @change="checkBoxChange"
          />
          <div class="left">
            <div class="img">
              <img :src="p.url" alt="" />
            </div>
          </div>
          <div class="right">
            <div class="text">
              <p class="name">{{ p.name }}</p>
              <p class="desc">{{ p.desc }}</p>
              <p class="price">￥{{ p.price }}</p>
            </div>
            <div class="step">
              <van-stepper
                :id="p._id"
                :value="p.num"
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
  mounted() {},
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
          for (let p of item.children) {
            if (p.checked) {
              chooseProduct.push(p);
              total += p.num * p.price;
            }
          }
        }
        this.setProduct(chooseProduct);
        this.setTotal(total);
        console.log(this.product);
      },
      deep: true,
      immediate: true,
    },
    items: {
      handler(value) {
        this.productList = value;
        console.log("plist", value);
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    ...mapActions(["setTotal", "setProduct"]),
    fetch() {
      console.log(1);
    },
    addNumByKey(objArray, property) {
      var array = [];
      return objArray.reduce((acc, obj, idx, arr) => {
        if (array.includes(obj.property)) {
          acc[idx - 1].num += 1;
        } else {
          array.push(obj.property);
          acc.push(obj);
        }
        return acc;
      }, []);
    },
    checkBoxChange(value) {
      console.log(value);
      let id = value.currentTarget.id;
      let { productList } = this;
      for (let item of productList) {
        for (let p of item.children) {
          if (p._id == id) {
            p.checked = !p.checked;
          }
        }
      }
    },
    onChange(value) {
      console.log(value);
      let id = value.currentTarget.id;
      let detail = value.detail;
      let { productList } = this;
      for (let item of productList) {
        for (let p of item.children) {
          if (p._id == id) {
            p.num = detail;
          }
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  .product-wrap {
    background-color: white;
    padding-bottom: 30upx;
    .list-wrap {
      background-color: white;
      .type-name {
        font-size: 13px;
        margin: 20upx 0;
      }
      .list {
        display: flex;
        align-items: center;
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
            .name {
              color: black;
              font-size: 15px;
            }
            .desc {
              color: black;
              font-size: 14px;
            }
            .price {
              color: red;
              font-size: 13px;
            }
          }
          .step {
          }
        }
      }
    }
  }
}
</style>
