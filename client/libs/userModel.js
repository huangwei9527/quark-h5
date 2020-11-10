/**
 * 账号相关操作模块
 * */
import store from '@/store'
import router from '@/router'
import {
	login,
	register,
	getUserInfo
} from '@/api'

let userModel = {
	/**
	 * 检测是否登录
	 * @returns {Promise<void>}
	 */
	async checkLoginState() {
		let userData = store.state.user;
		return !!userData.access_token
	},
	/**
	 * 登录
	 * @param options
	 * @param type
	 * @returns {Promise<void>}
	 */
	async doLogin(data) {
		return new Promise((resolve, reject) => {
			login(data).then(res => {
				store.commit('UPDATE_ACCESS_TOKEN', res.body.access_token)
				store.commit('UPDATE_USER_INFO', res.body.userInfo)
				resolve(res.body)
			})
				.catch(err => {
					reject(err)
				})
		})
	},
	/**
	 * 注册
	 * @param options
	 * @param type
	 * @returns {Promise<void>}
	 */
	async doRegister(data) {
		return new Promise((resolve, reject) => {
			register(data).then(res => {
				store.commit('UPDATE_ACCESS_TOKEN', res.body.access_token)
				store.commit('UPDATE_USER_INFO', res.body.userInfo)
				resolve(res.body)
			})
				.catch(err => {
					reject(err)
				})
		})
	},
	/**
	 * 获取用户信息
	 * @returns {Promise<void>}
	 * @private
	 */
	getUserInfo() {
		return new Promise((resolve, reject) => {
			getUserInfo().then(res => {
				store.commit('UPDATE_USER_INFO', res.body);
				resolve(res.body)
			}).catch(err => {
				reject(err)
			})
		})
	},
	/**
	 * 退出
	 * @returns {Promise<void>}
	 */
	async doLogout() {
		// 清除store user token
		store.commit('UPDATE_ACCESS_TOKEN', '');
		window.sessionStorage.setItem('beforeLoginUrl', '');
		userModel.goLogin()
	},
	/**
	 * 跳转登录
	 * @returns {Promise<void>}
	 */
	async goLogin() {
		// 将路由fullpath 保存在缓存中，用于登录完成后跳转
		let indexOf = window.location.href.indexOf('#/')
		let currentUrl = window.location.href.slice(indexOf + 1, window.location.href.length);
		window.sessionStorage.setItem('beforeLoginUrl', currentUrl);
		store.commit('UPDATE_ACCESS_TOKEN', '');
		router.push({name: 'Login'})
	},

	async goBeforeLoginUrl(){
		let url = window.sessionStorage.getItem('beforeLoginUrl');
		if (!url || url.indexOf('/login') != -1) {
			router.push('/');
		} else {
			router.push(url);
			window.sessionStorage.setItem('beforeLoginUrl', '');
		}
	}
}

export default userModel
