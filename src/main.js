import Vue from './common/mixin'
import App from './App'
import {localStore} from './common/utils'
import store from './store'
import http from './common/luch-request'

import loading from './components/loading.vue'

Vue.config.productionTip = false

Vue.prototype.$localStore = localStore
Vue.prototype.$http = http

Vue.component('loading', loading)

Vue.prototype.$toast = (title)=>{
  uni.showToast({
      icon: 'none',
      title: title
  });
}

App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})
app.$mount()
