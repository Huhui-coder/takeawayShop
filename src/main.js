import Vue from './common/mixin'
import App from './App'
import {localStore} from './common/utils'
import store from './store'




Vue.config.productionTip = false

Vue.prototype.$localStore = localStore

App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})
app.$mount()
