module.exports = app => ({
	/**
	 * 获取我的页面列表
	 * @returns {Promise<*>}
	 */
	async getMyPages(pageMode, type) {
		const {ctx, $model} = app;
		let userData = ctx.userData
		let query = { pageMode: pageMode, isTemplate: {$ne: true}};
		if(type === 'my'){
			query.author = userData._id
		}else if(type === 'cooperation'){
			query.members = {$elemMatch: {$in: userData._id}}
		}
		return await $model.page.find(query).select('_id title coverImage isPublish').exec();
	},
	/**
	 * 获取我的页面数量
	 * @returns {Promise<void>}
	 */
	async getMyPagesCount(pageMode){
		const {ctx, $model} = app;
		let userData = ctx.userData
		let query = {author: userData._id, pageMode: pageMode, is_delete: {$ne: true}, isTemplate: {$ne: true}};
		return await $model.page.count(query);
	},
	/**
	 * 获取我的协作页面数量
	 * @returns {Promise<void>}
	 */
	async getCooperationPagesCount(pageMode){
		const {ctx, $model} = app;
		let userData = ctx.userData
		let query = {members: {$elemMatch: {$in: userData._id}}, pageMode: pageMode, is_delete: {$ne: true}, isTemplate: {$ne: true}};
		return await $model.page.count(query);
	},
	/**
	 * 获取我的模板列表
	 * @param pageMode
	 */
	async getMyTemplates(pageMode){
		const {ctx, $model} = app;
		let userData = ctx.userData
		let query = {author: userData._id, isTemplate: true};
		if (pageMode) {
			query.pageMode = pageMode;
		}
		return await $model.page.find(query).select('_id title coverImage').exec();
	},
	/**
	 * 创建页面
	 * @param pageData
	 * @returns {Promise<*>}
	 */
	async create(pageData){
		const {ctx, $model} = app;
		let userData = ctx.userData
		return await $model.page.create({
			...pageData,
			author: userData._id,
		})
	},
	/**
	 * 更新修改页面
	 * @param pageData
	 * @returns {Promise<*>}
	 */
	async update(pageData){
		const {$model} = app;
		return await $model.page.findOneAndUpdate({_id: pageData._id}, { $set: pageData }, {
			runValidators: true
		})
	},
	/**
	 * 彻底删除文档
	 * @param id
	 * @returns {Promise<boolean>}
	 */
	async deletePage(id) {
		const { $model } = app;
		return await $model.page.remove({_id: id});
	},
	/**
	 * 获取页面详情
	 * @param id
	 * @returns {Promise<*>}
	 */
	async getPageDetail(id){
		const { $model } = app;
		return await $model.page.findById(id).exec()
	},
	/**
	 * 发布页面
	 * @param id
	 * @returns {Promise<*>}
	 */
	async setPublish(id){
		const { $model } = app;
		return await $model.page.findByIdAndUpdate(id, {$set: {isPublish: true}})
	},
	/**
	 * 通过user list 添加协作人
	 * @param pageId
	 * @param userIds
	 * @returns {Promise<$addToSet.cooperation_user|{$each}|query.cooperation_user|{$elemMatch}>}
	 */
	async addCooperationUser(pageId, userIds) {
		const {$model} = app;
		await $model.page.findByIdAndUpdate(pageId, {
			$addToSet: {members: {$each: userIds}}
		})
		let pageData = await $model.page.findOne({_id: pageId}).populate({
			path: 'members',
			model: $model.user,
			select: 'name username _id email avatar'
		}).exec();
		pageData = pageData.toObject();
		return pageData.members
	},
	/**
	 * 获取协作人列表
	 * @param pageId
	 * @returns {Promise<RegExpExecArray>}
	 */
	async getCooperationUserListByPageId(pageId) {
		const {$model} = app;
		let doc = await $model.page.findOne({_id: pageId}).populate({
			path: 'members',
			model: $model.user,
			select: 'name username _id email avatar '
		}).exec();
		doc = doc.toObject();
		return doc.members
	},
	/**
	 * 移出协作人
	 * @param pageId
	 * @param userId
	 * @returns {Promise<*>}
	 */
	async removeCooperationUser(pageId, userId) {
		const {$model} = app;
		return await $model.page.updateOne({_id: pageId}, {$pull: {members: userId}}, {
			runValidators: true
		})
	},
	/**
	 * 获取模板市场所有模板
	 * @param pageMode
	 * @returns {Promise<*>}
	 */
	async getPublishTemplates(pageMode){
		const {$model} = app;
		let query = {isPublish: true, isTemplate: true};
		if (pageMode) {
			query.pageMode = pageMode;
		}
		return await $model.page.find(query).select('_id title coverImage').exec();
	},
});
