/**
 * 用户相关
 */
import {setLocalStorage, getLocalStorage} from '@/common/js/mUtils'
const state = {
	access_token: '',
	permissionsList: [],
	userInfo: {},
}
const actions = {

};

const mutations = {
	/**
	 * 更新用户data info数据
	 */
	UPDATE_USER_INFO(state, data) {
		state.userInfo = {...data}
		// 存储状态
		mutations['SAVE_USER_TO_LOCAL'](state)
	},
	/**
	 * 更新oauth相关
	 */
	UPDATE_ACCESS_TOKEN(state, data) {
		state.access_token = data || ''
		// 存储状态
		mutations['SAVE_USER_TO_LOCAL'](state)
	},
	/**
	 * 更新个人权限相关
	 * @param state
	 * @param data
	 */
	UPDATE_USER_PERMISSION(state, data) {
		state.permissionsList = data || [];
		// 存储状态
		mutations['SAVE_USER_TO_LOCAL'](state)
	},

	/**
	 * 将user state 数据存储在localstore里面
	 * @param state
	 */
	SAVE_USER_TO_LOCAL(state) {
		setLocalStorage('user', state)
	},
	/**
	 * 从localstorage里取出数据更新user
	 * @param state
	 */
	UPDATE_USER_FROM_LOCAL(state) {
		let user = getLocalStorage('user')
		if (user) {
			for (let key in state) {
				state[key] = user[key]
			}
		}
	}
}


const getters = {
	authorization(state) {
		return state.access_token ? 'Bearer ' + state.access_token : ''
	},
	userInfo(state) {
		return state.userInfo
	}
};


export default {
	state,
	actions,
	getters,
	mutations
}
