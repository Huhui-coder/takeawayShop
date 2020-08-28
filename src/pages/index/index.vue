<template>
    <skeleton :row="12" animate :loading="loading" style="margin-top:124rpx;" :banner="true" :title="true">
  <view class="content">
    <view class="merchant-wrap">
      <view class="desc">
        <view class="name">{{ merchantInfo.shopName }}</view>
        <view class="merchantDesc">{{ merchantInfo.merchantDesc }}</view>
        <view class="support">
          <span class="text">本店支持</span>
          <van-tag type="primary" class="tag">门店自提</van-tag>
          <van-tag type="success" class="tag">外卖配送</van-tag>
        </view>
        <view class="info">
          <p class="text" @click="showInfo">
            查看商家信息 <van-icon :name="show ? 'arrow-up' : 'arrow-down'" />
          </p>
          <view class="more" :class="[show ? 'show' : 'hidden']">
            <p>
              <van-icon name="phone-o" size="15" />
              <span
                style="margin-left:5px"
                @click="phone(merchantInfo.merchantPhone)"
                >{{ merchantInfo.merchantPhone }}</span
              >
            </p>
            <p>
              <van-icon name="location-o" size="15" />
              <span style="margin-left:5px">{{
                merchantInfo.merchantAddress
              }}</span>
            </p>
          </view>
        </view>
      </view>
    </view>
    <view class="tab-wrap">
      <van-notice-bar
        left-icon="volume-o"
        mode="closeable"
        :text="merchantInfo.announcement"
      />
      <van-tabs active="order" swipeable>
        <van-tab title="下单" name="order">
          <order :items="productItems" class="order"/>
        </van-tab>
        <van-tab title="我的订单" name="list">
          <list :items="orderList" />
        </van-tab>
      </van-tabs>
      <van-overlay :show="!merchantInfo.status" @click="onClickHide">
        <view class="wrapper">
          该商铺已关闭
        </view>
      </van-overlay>
    </view>

  </view>
  </skeleton>
</template>

<script>
import { login, preLogin, allOrder } from "../../common/api";
import order from "./components/order";
import list from "./components/list";
import { mapState, mapActions } from "vuex";
import skeleton from '../../components/xinyi-skeleton/skeleton'

export default {
  components: {
    order,
    list,
    skeleton
  },
  data() {
    return {
      productItems: [],
      orderList: [],
      merchantInfo: {
        status: true,
      },
      show: false,
      loading: false
    };
  },
  mounted() {
    this.setMerchantId("5f45edfacc91256a4856ae6f");
    this.login();
    this.loading = true
  },
  onLoad() {},
  computed: {
    ...mapState({
      merchantId: (state) => state.merchantId,
    }),
  },
  methods: {
    ...mapActions(["setMerchantId"]),
    onClickHide() {
      console.log(1);
    },
    phone(tel) {
      uni.makePhoneCall({
        phoneNumber: tel,
      });
    },
    showInfo() {
      this.show = !this.show;
    },
    login() {
      let that = this;
      wx.login({
        success: (res) => {
          console.log("用户的code：" + res.code);
          // 先请求 preLogin 获取用户的 openid 和 session_key
          const params = {
            appid: "wxb956b63cebf6677f",
            grant_type: "authorization_code",
            js_code: res.code,
          };
          preLogin(params).then((res) => {
            let openid = res.data.openid; //获取到的openid
            that.$localStore.set("openid", openid);
            let session_key = res.data.session_key; //获取到session_key
            let { merchantId } = that;
            const params = { openid, session_key, merchantId };

            login(params).then((res) => {
              let p_data = res.data.product;
              that.merchantInfo = res.data;
              var nData = p_data.filter((item) => item.status === "normal");
              var newArray = [];
              var reducer = function(
                accumulator,
                currentValue,
                currentIndex,
                array
              ) {
                if (accumulator.includes(currentValue.pType)) {
                  newArray.map((item) => {
                    if (item.text === currentValue.pType) {
                      item.children.push(currentValue);
                    }
                  });
                } else {
                  accumulator.push(currentValue.pType);
                  newArray.push({
                    text: currentValue.pType,
                    children: [].concat(currentValue),
                  });
                }
                return accumulator;
              };
              nData.reduce(reducer, []);
              that.productItems = newArray;
              let openid = that.$localStore.get("openid");
              allOrder({ openid }).then((res) => {
                that.orderList = res.data;
                that.loading = false
              });
            });
          });
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  max-height: 100vh;
  .merchant-wrap {
    background-color: #ff6600;
    color: white;
    padding: 20upx;
    .desc {
      .name {
        font-size: 16px;
        font-weight: bolder;
        padding: 20upx 0;
      }
      .merchantDesc {
        font-size: 12px;
      }
      .support {
        font-size: 12px;
        margin-right: 20upx;
        .tag,
        .text {
          margin-right: 20upx;
        }
      }
      .info {
        .text {
          text-align: center;
          color: #fff;
          font-size: 12px;
          margin: 10upx 0;
        }
        .more {
          padding: 20upx;
          border: 1px solid #e95d00;
          background-color: #e95d00;
          border-radius: 20px;
          font-size: 12px;
          transition: all 0.5s;
          display: flex;
          justify-content: center;
          overflow: hidden;
          flex-direction: column;
        }
        .show {
          max-height: 200upx;
        }
        .hidden {
          max-height: 0;
          padding: 0;
          border: 0;
        }
      }
    }
  }
  .tab-wrap {
  }
}
.order {
  min-height: calc(100vh - 220upx);
}
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #fff;
}
</style>
