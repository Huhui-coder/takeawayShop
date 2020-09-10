<template>
  <view>
    <view v-if="loading" class="skeleton" :class="{ animate: animate }">
      <view class="skeleton-content">
        <view v-if="showTitle" class="skeleton-title" :style="{ width: titleWidth }"></view>
        <view class="skeleton-main">
          <view class="skeleton-colunm">
          <view
            class="skeleton-colunm-item"
          ></view>
        </view>
          <view class="skeleton-rows">
          <view
            class="skeleton-row-item"
            v-for="(item, index) in rowList"
            :key="index"
            :style="{ width: item.width }"
          ></view>
        </view>
        </view>
        <view class="skeleton-footer" :style="{ width: titleWidth }">
        </view>
      </view>
    </view>
    <view v-else><slot></slot></view>
  </view>
</template>

<script>
const DEFAULT_ROW_WIDTH = '100%'

export default {
  props: {
    loading: {
      type: Boolean,
      default: true,
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
    titleWidth: {
      type: String,
      default: '100%',
    },
    row: {
      type: Number,
      default: 3,
    },
    animate: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    rowList() {
      let list = []
      for (let i = 0; i < this.row; i++) {
        list.push({
          width: DEFAULT_ROW_WIDTH,
        })
      }
      return list
    },
  },
}
</script>

<style scoped>
.skeleton {
  display: flex;
  padding: 16px;
  --bg-color: #f2f3f5;
  --row-height: 4vh;
  --row-margin-top: 16px;
}

.skeleton-content {
  width: 100%;
}

.skeleton-title {
  background-color: var(--bg-color);
  height: 20vh;
}

.skeleton-title + .skeleton-rows {
  margin-top: var(--row-margin-top);
}

.skeleton-main{
  display: flex;
  margin-top: var(--row-margin-top);
}
.skeleton-colunm, .skeleton-rows{
  height: 60vh;
  overflow: hidden;
}
.skeleton-colunm{
  width: 200rpx;
  margin-right: var(--row-margin-top);
  background-color: var(--bg-color);
}

.skeleton-rows {
  flex: 1;
}

.skeleton-row-item {
  background-color: var(--bg-color);
  height: var(--row-height);
}
.skeleton-row-item:not(:first-child) {
  margin-top: var(--row-margin-top);
}
.skeleton-footer{
  background-color: var(--bg-color);
  height: 9vh;
  margin-top: var(--row-margin-top);
}

.skeleton.animate {
  animation: skeleton-blink 1s ease-in-out infinite;
}

@keyframes skeleton-blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}
</style>
