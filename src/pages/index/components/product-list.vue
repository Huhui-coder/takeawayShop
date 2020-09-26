<template>
  <div class="content">
    <div class="product-wrap">
      <scroll-view
        scroll-y
        style="height: calc(100vh - 375upx);"
        scroll-with-animation
        :scroll-into-view="mainCur"
        @scroll="VerticalMain"
      >
        <div
          class="list-wrap"
          v-for="(item, index) in productList"
          :key="index"
          :id="'item_' + index"
        >
          <p class="type-name">{{ item.text }}</p>
          <div class="list" v-for="p in item.children" :key="p._id">
            <van-checkbox
              :value="p.checked"
              :id="p._id"
              @change="checkBoxChange"
            />
            <div class="left">
              <div class="img" @tap="showProductModal(p)">
                <image
                  class="img"
                  mode="scaleToFill"
                  lazy-load
                  :src="p.url"
                ></image>
              </div>
            </div>
            <div class="right" @tap="toggleProduct(p._id)">
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
      </scroll-view>
    </div>

    <!-- 单个商品展示详情-->
    <van-dialog
      use-slot
      :title="currentProduct.name"
      :show="showDialog"
      @close="onClose"
      @confirm="onClose"
    >
      <image :src="currentProduct.url" />
      <p style="text-align:center">{{ currentProduct.desc }}</p>
    </van-dialog>

    <!-- <van-overlay :show="showDialog" @click="onClose">
        <view class="wrapper">
          <view class="content">
          <image :src="currentProduct.url" />
          <p style="text-align:center">{{currentProduct.desc}}</p>
          </view>
        </view>
      </van-overlay> -->
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
    mainCur: {
      type: String,
      default: "item_" + 0,
    },
  },
  data() {
    return {
      currentProduct: {},
      showDialog: false,
      itemsList: [],
      productList: [],
      currentId: 0,
      load: true,
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
        console.log(total);
        this.setTotal(total);
      },
      deep: true,
      immediate: true,
    },
    items: {
      handler(value) {
        this.productList = value;
        console.log("productList", this.productList);
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    ...mapActions(["setTotal", "setProduct"]),
    onClose() {
      this.showDialog = false;
    },
    VerticalMain(e) {
      let that = this;
      let tabHeight = 0;
      if (this.load) {
        for (let i = 0; i < this.productList.length; i++) {
          let view = uni
            .createSelectorQuery()
            .in(this)
            .select("#item_" + i);
          view
            .fields(
              {
                size: true,
              },
              (data) => {
                this.productList[i].top = tabHeight;
                tabHeight = tabHeight + data.height;
                this.productList[i].bottom = tabHeight;
              }
            )
            .exec();
        }
        this.load = false;
      }
      let scrollTop = e.detail.scrollTop + 10;
      for (let i = 0; i < this.productList.length; i++) {
        if (
          scrollTop > this.productList[i].top &&
          scrollTop < this.productList[i].bottom
        ) {
          this.verticalNavTop = (i - 1) * 50;
          this.tabCur = i;
          this.$emit("scroll-update", i);
          return false;
        }
      }
    },
    fetch() {},
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
    emptyAllProduct() {
      for (let item of this.productList) {
        for (let p of item.children) {
          p.checked = false;
        }
      }
    },
    checkBoxChange(value) {
      console.log(value)
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
    toggleProduct (id) {
      let { productList } = this;
      for (let item of productList) {
        for (let p of item.children) {
          if (p._id == id) {
            p.checked = !p.checked;
          }
        }
      }
    },
    showProductModal(v) {
      this.currentProduct = v;
      this.showDialog = true;
    },
    onChange(value) {
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
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  .content {
    background-color: #fff;
    padding: 40rpx;
    border: 1px solid #fff;
    border-radius: 33px;
    width: 640rpx;
    image {
      width: 640rpx;
      height: 480rpx;
      display: inline-block;
      overflow: hidden;
    }
  }
}
.content {
  .product-wrap {
    background-color: white;
    margin-bottom: 100upx;
    .list-wrap {
      background-color: white;
      .type-name {
        font-size: 13px;
        margin: 20upx 0;
      }
      .list {
        display: flex;
        align-items: center;
        margin: 20rpx 0;
        .left {
          margin-left: 20rpx;
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
            width: 105px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
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
