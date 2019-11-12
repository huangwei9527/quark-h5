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
		_event_submitForm(eventData, element, page){
			return new Promise((resolve) => {
				// 获取提交接口
				let apiUrl = eventData.url;
				// 获取页面表单数据
				let formdata ={}
				page.pages.forEach(data => {
					data.elements.forEach(item => {
						if(!item.isForm) return;
						let key = item.propsValue.keyName || '';
						formdata[key] = item.value;
					})
				})
				console.log(formdata)
				resolve()
			})
		}
	}
}
