import http from './luch-request'


// 测试
export const test = (data) => {
	return http.request({
		url: '/user/test',
		data,
		method: 'get'
	})
}

// 登录
export const login = (data) => {
	return http.request({
		url: '/user/login',
		data,
		method: 'post'
	})
}
// 下单
export const order = (data) => {
	return http.request({
		url: '/user/order',
		data,
		method: 'post'
	})
}

// 查询单个订单
export const singleOrder = (data) => {
	return http.request({
		url: '/user/order',
		data,
		method: 'get'
	})
}

// 查询全部订单
export const allOrder = (data) => {
	return http.request({
		url: '/user/allOrder',
		data,
		method: 'get'
	})
}

