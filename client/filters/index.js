/**
 * 封装些共用的过滤器
 */
const filter = {
	/**
	 * 将 boolean 转换成 文字是否
	 * @param value
	 * @returns {string}
	 */
	booleanToText: function(value){
		return value ? '是' : '否'
	},
	/**
	 * 根据value获取label
	 * @param value
	 * @param list 对象列表
	 */
	getLabelText(value, list, label = 'label') {
		let data = list.find(v => v.value === value);
		if (data) {
			return data[label];
		} else {
			return ''
		}
	}
}

export default filter
