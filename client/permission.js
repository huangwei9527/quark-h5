/**
 *  路由权限相关管理
 * */
import router from '@/router'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import * as mUtils from '@client/common/js/mUtils'
import store from '@client/store'

router.beforeEach((to, from, next) => {
	NProgress.start()
	let userData = store.state.user;
	if (!userData.token && !to.meta.noNeedLogin) {
		mUtils.Cookie.set('beforeLoginUrl',encodeURIComponent(to.fullPath), 1/24/60, window.location.host, window.location.pathname.substring(0, window.location.pathname.length-1)) // 保存用户进入的url
		// 跳转到登录
		next({
			path: '/login',
			query: to.query
		});
		return false
	}
	next()
})

router.afterEach(() => {
	NProgress.done() // 结束Progress
})

