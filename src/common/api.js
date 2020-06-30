import http from './luch-request'

const prefix = ''

// 发送验证码
export const sendCode = (data) => {
	return http.request({
		url: prefix + '/users/authcode',
		data,
		method: 'post'
	})
}

// 登录
export const login = (data) => {
	return http.request({
		url: prefix + '/login',
		data,
		method: 'post'
	})
}