module.exports = app => ({
	/**
	 * 通过用户列表添加协作人
	 * @returns {Promise<void>}
	 */
	async addCooperationUser(){
		const {ctx, $service, $helper} = app;
		const {userIds, pageId} = ctx.request.body;
		let cooperationList = await $service.page.addCooperationUser(pageId, userIds);
		$helper.returnBody(true, cooperationList)
	},
	/**
	 * 获取协作人列表
	 * @returns {Promise<void>}
	 */
	async getCooperationUserListByPageId(){
		const {ctx, $service, $helper} = app;
		const {pageId} = ctx.request.query;
		let cooperationList = await $service.page.getCooperationUserListByPageId(pageId);
		$helper.returnBody(true, cooperationList)
	},
	/**
	 * 删除协作人
	 * @returns {Promise<void>}
	 */
	async removeCooperationUser(){
		const {ctx, $service, $helper} = app;
		const {pageId, userId} = ctx.request.body;
		const cooperationList = await $service.page.removeCooperationUser(pageId, userId);
		$helper.returnBody(true, cooperationList)
	},

})
