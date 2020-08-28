import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        //购物车数据
        isAllSelect: false, // 是否全选
        total: 0, // 总价
        product: [], // 购物车中的商品
        // 订单数据
        order: {},
        remake: '',
        orderType: '',
        merchantId:'',
        showLoading: false,
    },
    getters: {},
    mutations: {
        updateIsAllSelect(state, data) {
            state.isAllSelect = data
        },
        updateTotal(state, data) {
            state.total = data
        },
        updateProduct(state, data) {
            state.product = data
        },
        updateOrder(state, data) {
            state.order = data
        },
        updateRemake(state, data) {
            state.remake = data
        },
        updateOrderType(state, data) {
            state.orderType = data
        },
        updateMerchantId(state, data) {
            state.merchantId = data
        },
        updateLoading(state, data) {
            state.showLoading = data
        },
    },
    actions: {
        setIsAllSelect({ commit }, data) {
            commit('updateIsAllSelect', data)
        },
        setTotal({ commit }, data) {
            commit('updateTotal', data)
        },
        setProduct({ commit }, data) {
            commit('updateProduct', data)
        },
        setOrder({ commit }, data) {
            commit('updateOrder', data)
        },
        setRemake({ commit }, data) {
            commit('updateRemake', data)
        },
        setOrderType({ commit }, data) {
            commit('updateOrderType', data)
        },
        setMerchantId({ commit }, data) {
            commit('updateMerchantId', data)
        },
        setLoading({ commit }, data) {
            commit('updateLoading', data)
        },
    }
})
