import Vue from 'vue'
import Vuex from 'vuex'

// 各个模块
import editor from './modules/editor'
import user from './modules/user'


import { Message } from 'element-ui'
/**
 * 全局状态管理
 */
const state = {

};
const actions = {

	/**
	 * 显示提示 msg.type 类型  msg.data 消息内容
	 * @param commit
	 * @param msg
	 */
	showMassage(store, msg) {
		console.log(msg)
		Message({
			type: msg.type,
			message: msg.message || msg.data
		})
	},
};
const mutations = {};
const getters = {};

Vue.use(Vuex);
export default new Vuex.Store({
	state,
	getters,
	actions,
	mutations,
	modules: {
		editor,
		user
	}
});
