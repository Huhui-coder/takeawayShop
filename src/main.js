import Vue from './common/mixin'
import App from './App'
import {localStore} from './common/utils'
import store from './store'
import http from './common/luch-request'




Vue.config.productionTip = false

Vue.prototype.$localStore = localStore
Vue.prototype.$http = http



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
