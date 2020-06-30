<template>
  <div class="content">
    <div class="main">
      <div class="address-wrap">
        <van-cell-group>
          <van-field
            :value="addressInfo.name"
            placeholder="请输入姓名"
            required
            clearable
            label="姓名"
            @change="changeField($event, 'name')"
          />
          <van-field
            :value="addressInfo.phone"
            placeholder="请输入电话"
            label="电话"
            required
            clearable
            type="number"
            @change="changeField($event, 'phone')"
          />
          <view @click="showPopup">
            <van-field
              :value="addressInfo.address"
              disabled
              placeholder="请输入地址"
              required
              clearable
              label="地址"
            />
          </view>
          <van-field
            :value="addressInfo.detail"
            placeholder="请输入详细地址"
            required
            clearable
            label="详细地址"
            @change="changeField($event, 'detail')"
          />
        </van-cell-group>
      </div>
    </div>
    <van-popup :show="show" position="bottom" closeable>
      <van-area
        :area-list="areaList"
        :title="areaTitle"
        value="500108"
        @confirm="confirm"
        @cancel="cancel()"
      />
    </van-popup>
    <van-button type="danger" size="large" @click="submit">确认提交</van-button>
    <van-toast id="van-toast" />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Toast from "../../wxcomponents/vant/dist/toast/toast";
import AreaList from "./area";

export default {
  data() {
    return {
      show: false,
      areaTitle: "选择省市区",
      areaList: AreaList,
      addressInfo: {
        name: "",
        phone: "",
        address: "",
        detail: "",
      },
    };
  },
  onLoad(option) {
    if (this.objectNotEmpty(option)) {
      let data = JSON.parse(decodeURIComponent(option.address));
      let array = Object.values(data);
      let notEmpty = array.filter((_) => _ !== "").length > 0;
      this.addressInfo = Object.assign({}, data);
    }
  },
  computed: {
    ...mapState({
      address: (state) => state.address,
    }),
  },
  methods: {
    ...mapActions(["setAddress"]),
    // 是否为一个空对象
    objectNotEmpty(data) {
      let array = Object.values(data);
      return array.filter((_) => _ !== "").length > 0;
    },
    // 对象里面的每个值是否都不为空
    objectAllNotEmpty(data) {
      let array = Object.values(this.addressInfo);
      let index = Object.keys(this.addressInfo).length;
      return array.filter((_) => _ !== "").length === index;
    },
    changeField(e, filed) {
      console.log(e, filed);
      this.addressInfo[filed] = e.detail;
    },
    confirm(e) {
      console.log("confirm");
      let addressArray = e.detail.values;
      let address = "";
      for (let item of addressArray) {
        address += item.name;
      }
      console.log(address);
      this.addressInfo.address = address;
      this.show = false;
    },
    cancel() {
      console.log("cancel");
      this.show = false;
    },
    onClickLeft() {
      uni.navigateBack({
        delta: 1,
      });
    },
    onClickRight() {
      console.log("right");
    },
    showPopup() {
      console.log(11);
      this.show = true;
    },
    submit() {
      if (this.objectAllNotEmpty(this.addressInfo)) {
        this.setAddress(this.addressInfo);
        uni.navigateBack({
          delta: 1,
        });
      } else {
        Toast.fail("有尚未完成的选项");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  .nav {
    padding-top: 20upx;
  }
  .main {
    width: 80vw;
    margin: 0 auto;
    .address-wrap {
    }
  }
}
</style>
