<template>
  <view class="content">
    <view class="merchant-wrap">
      <view class="desc">
        <view class="name">{{ merchantInfo.merchantName }}</view>
        <view class="merchantDesc">{{ merchantInfo.merchantDesc }}</view>
        <view class="support">
          <span class="text">本店支持</span>
          <van-tag type="primary" class="tag">门店自提</van-tag>
          <van-tag type="success" class="tag">外卖配送</van-tag>
        </view>
        <view class="info">
          <p class="text" @click="showInfo">查看商家信息 <van-icon :name="show ? 'arrow-up': 'arrow-down'" /></p>
          <view class="more" :class="[show ? 'show' : 'hidden']">
            <p>
              <van-icon name="phone-o" size="15"/>
              <span style="margin-left:5px" @click="phone(merchantInfo.merchantPhone)">{{merchantInfo.merchantPhone}}</span> </p>
            <p>
              <van-icon name="location-o" size="15"/>
              <span style="margin-left:5px">{{merchantInfo.merchantAddress}}</span> </p>
          </view>
          <!-- <van-dropdown-menu>
            <van-dropdown-item title="查看商家信息">
              <van-cell title="电话" :value="merchantInfo.merchantPhone" />
              <van-cell title="地址" :value="merchantInfo.merchantAddress" />
            </van-dropdown-item>
          </van-dropdown-menu> -->

        </view>
      </view>
    </view>
    <view class="tab-wrap">
      <van-tabs active="order" swipeable>
        <van-tab title="下单" name="order">
          <order :items="productItems" />
        </van-tab>
        <van-tab title="我的订单" name="list">
          <list :items="orderList" />
        </van-tab>
      </van-tabs>
    </view>
  </view>
</template>

<script>
import { login, test, allOrder } from "../../common/api";
import order from "./components/order";
import list from "./components/list";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    order,
    list,
  },
  data() {
    return {
      productItems: [],
      orderList: [],
      merchantInfo: {},
      show: false
    };
  },
  mounted() {
    this.setMerchantId("5f0864d3703148619a8ab985");
    this.login();
    // this.test();
  },
  onLoad() {},
  computed: {
    ...mapState({
      merchantId: (state) => state.merchantId,
    }),
  },
  methods: {
    ...mapActions(["setMerchantId"]),
    phone(tel) {
      uni.makePhoneCall({
        phoneNumber: tel,
      });
    },
    showInfo(){
      this.show = !this.show
    },
    test() {
      wx.cloud.init(); //调用前需先调用init
      wx.cloud
        .callFunction({
          name: "test",
          data: {},
        })
        .then((res) => {
          console.log(res.result);
        });
    },
    login() {
      let that = this;
      wx.login({
        success: (res) => {
          // 获取到用户的 code 之后：res.code
          console.log("用户的code：" + res.code);
          // 可以传给后台，再经过解析获取用户的 openid
          // 或者可以直接使用微信的提供的接口直接获取 openid ，方法如下：
          wx.request({
            url: "https://api.weixin.qq.com/sns/jscode2session", //接口地址
            data: {
              appid: "wxafd014ef39980177",
              secret: "979625ca6571f4080b94610b4e024ed8",
              js_code: res.code,
              grant_type: "authorization_code",
            },
            header: {
              "content-type": "application/json", //默认值
            },
            success: function(res) {
              console.log(res.data);
              // let openid = res.data.openid; //获取到的openid
              let openid = "898989"; //获取到的openid
              that.$localStore.set("openid", openid);

              let session_key = res.data.session_key; //获取到session_key
              let { merchantId } = that;
              //如果返回成功，则将OPEN_ID和SESSION_KEY提交请求给本地服务器
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
                });
              });
            },
          });
        },
      });
      // test().then((res) => {
      //   console.log(res);
      // });
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
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
      .merchantDesc{
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
      .info{
        .text{
          text-align: center;
          color: #fff;
          font-size: 12px;
          margin: 10upx 0;
        }
        .more{
          padding:20upx;
          border: 1px solid #e95d00;
          background-color: #e95d00;
          border-radius: 20px;
          font-size: 12px;
          transition: all .5s;
          display: flex;
          justify-content: center;
          overflow: hidden;
          flex-direction: column;
        }
        .show{
          max-height: 200upx;
        }
        .hidden{
          max-height: 0;
          padding:0;
          border: 0;
        }
      }
    }
  }
  .tab-wrap {
  }
}
.vanTabs {
}
.vanTab {
  min-height: calc(100vh - 220upx);
}
.order {
  min-height: calc(100vh - 220upx);
}
</style>
