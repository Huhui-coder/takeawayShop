// todo 字符串中不能有{} 不支持数组
export const localStore = {
	set: (key, value) => {
		if (Object.prototype.toString.call(value) === '[object Object]') {
			uni.setStorageSync(key, JSON.stringify(value))
		} else uni.setStorageSync(key, value)
	},
	get: key => {
		let val = ''
		try {
			val = uni.getStorageSync(key)
			if (typeof val === 'string' && val.indexOf('{') > -1 && val.indexOf('}') > -1) {
				val = JSON.parse(val)
			}
		} catch (e) {
		}
		return val
	},
	remove: key => {
		try {
			uni.removeStorageSync(key);
		} catch (e) {
			// error
			uni.setStorageSync(key, '')
		}
	}
}
export const deepClone = (obj) => {
	if (typeof obj !== 'object' && typeof obj !== 'function') {
		return obj // 原始类型直接返回
	}
	const o = Array.isArray(obj) ? [] : {}
	for (let i in obj) {
		if (obj.hasOwnProperty(i)) {
			o[i] = typeof obj[i] === 'object' ? deepClone(obj[i]) : obj[i]
		}
	}
	return o
}
export const getQueryStringArgs = (qs) => {

	//保存数据的对象
	let args = {},
		//取得每一项
		items = qs.length ? qs.split("&") : [],
		item = null,
		name = null,
		value = null,
		//在 for 循环中使用
		i = 0,
		len = items.length;
	//逐个将每一项添加到 args 对象中
	for (i = 0; i < len; i++) {
		item = items[i].split("=");
		name = decodeURIComponent(item[0]);
		value = decodeURIComponent(item[1]);
		if (name.length) {
			args[name] = value;
		}
	}

	return args;
}
// 节流
export function throttle(callback, wait = 3000) {
    let timer = null;
    let startTime;
    return function () {
        const ctx = this;
        const args = arguments;
        const now = +new Date();
        if (startTime && now < startTime + wait) {
            clearTimeout(timer);
            timer = setTimeout(function () {
                startTime = now;
                callback.apply(ctx, args);
            }, wait);
        } else {
            startTime = now;
            callback.apply(ctx, args);
        }
    }
}