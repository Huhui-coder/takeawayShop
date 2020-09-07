import Request from './request'
import CONFIG from '../config'
import { localStore } from '../utils'
import store from '../../store'


const http = new Request()
http.setConfig((config) => { /* 设置全局配置 */
  config.baseUrl = CONFIG.baseUrl
  config.timeout = 30000
  return config
})

/**
 * 自定义验证器，如果返回true 则进入响应拦截器的响应成功函数(resolve)，否则进入响应拦截器的响应错误函数(reject)
 * @param { Number } statusCode - 请求响应体statusCode（只读）
 * @return { Boolean } 如果为true,则 resolve, 否则 reject
 */
// 有默认，非必写
http.validateStatus = (statusCode) => {
  return statusCode === 200 || statusCode === 204
}

const localLogout = (res) => {
  uni.showToast({
    icon: 'none',
    title: '登录过期，请重新登录！'
  });
  // 清除server 存的 code 403 server没清
  localStore.remove('ncov-user-info')
	localStore.remove('ncov-access-token')
	uni.reLaunch({
		url: `/pages/login/login`
	})
  return Promise.reject(res)
}

http.interceptor.request(config => {
  store.dispatch('setLoading', true)
	config.header['ncov-access-token'] = localStore.get('ncov-access-token') || ''
	return config
}, error => {
	return Promise.reject(error)
})

http.interceptor.response(
  res => {
    store.dispatch('setLoading', false)
    if (res.statusCode === 403) return localLogout.call(res)
    if (res.statusCode === 204) return res // 获取验证码无返回 退出登录成功
	  if (['application/octet-stream', 'image/png', 'image/bmp'].includes(res.header['Content-Type'] || res.header['content-type'])) {
		  return res
	  }
    const {code, msg} = res.data
    if (code !== 200 && code !== 0 && code !== 204) {
      uni.showToast({
        icon: 'none',
        title: msg
      });
	    return Promise.reject(msg)
    } else return res.data
  },
  error => {
	  if (error.statusCode === 403) return localLogout.call(error)
	  return Promise.reject(error)
  }
)

export default http
