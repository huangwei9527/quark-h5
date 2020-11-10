/**
 *  元素点击事件相关方法
 * */
export default {
	methods: {
		/**
		 * 链接跳转
		 */
		_event_link(eventData) {
			return new Promise((resolve) => {
				if(eventData.url){
					window.location.href = eventData.url;
				}
				resolve()
			})
		},
		/**
		 * 分享
		 * @private
		 */
		_event_share() {
			return new Promise((resolve) => {
				window.alert('分享')
				resolve()
			})
		},
		/**
		 * 表单提交
		 * @private
		 */
		_event_submitForm(){
			return new Promise((resolve) => {
				window.alert('表单提交，待完善...')
				resolve()
			})
		}
	}
}
