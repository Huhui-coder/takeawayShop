import http from './luch-request'


// 测试
export const test = (data) => {
	return http.request({
		url: '/user/test',
		data,
		method: 'get'
	})
}

// 登录之前获取用户的openid 啥的
export const preLogin = (data) => {
	return http.request({
		url: '/user/preLogin',
		data,
		method: 'post'
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

// 根据地区名字转ip 地址 然后直接获得两点之间的距离
export const geocoding = (data) => {
	return http.request({
		url: '/user/geocoding',
		data,
		method: 'get'
	})
}


