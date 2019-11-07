/**
 * 用户数据状态管理
 */
const state = {
	token: '',
	permissionsList: [],
	userData: {
		avatar: '',
		level: ''
	}
};
const actions = {
	/**
	 * 更新个人信息
	 * @param commit
	 */
	updateUserInfo({commit}, userData){
		commit('updateUserInfo', userData)
	},
	/**
	 * 更新token
	 * @param commit
	 */
	updateUserToken({commit}, userData){
		commit('updateUserToken', userData)
	},
	/**
	 * 退出登录
	 */
	doLogout(){
		// todo
	}
};
const mutations = {
	/**
	 * 更新个人数据
	 * @param state
	 * @param data
	 */
	updateUserInfo(state, data){
		state.userData = {...data};
	},
	/**
	 * 更新token
	 * @param state
	 * @param data
	 */
	updateUserToken(state, data){
		state.token = data || '';
	}
};
const getters = {
	/**
	 * 获取登录认证信息token
	 * @param state
	 * @returns {string}
	 */
	authorization(state){
		return state.token ? ('Bearer ' + state.token) : ''
	},
	/**
	 * 用户信息
	 * @param state
	 * @returns {getters.userData|(function(*))|state.userData|{avatar, level}|*|userData}
	 */
	userData(state) {
		return state.userData
	}
};

export default {
	state,
	getters,
	actions,
	mutations
}
