/**
 * engine-h5-swiper 是多页面h5引擎模板
 */
import Template from './src/index.vue'

const install = function (Vue) {
	Vue.component(Template.name, Template)
}

// 检测到 Vue 才执行，毕竟我们是基于 Vue 的
if (typeof window !== 'undefined' && window.Vue) {
	install(window.Vue)
}

export default {
	install,
	// 所有组件，必须具有 install，才能使用 Vue.use()
	Template
}
