/**
 *  登陆相关mixins
 * */
export default {
	data() {
		return {

		}
	},
	methods: {
		/**
		 * 退出登录
		 */
		_logout() {
			this.$store.commit('UPDATE_OAUTH', {});
			sessionStorage.clear();
			this._linkToLogout();
		},
		_linkToLogout(){
			this.$router.push({path: '/login'})
		},
	}
}
