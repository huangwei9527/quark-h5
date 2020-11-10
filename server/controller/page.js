module.exports = app => ({
	/**
	 * 我的页面列表
	 * @returns {Promise<void>}
	 */
	async myPages() {
		const { ctx, $service, $helper } = app;
		let {pageMode, type} = ctx.request.query;
		const pages = await $service.page.getMyPages(pageMode, type);
		const myPageCount = await $service.page.getMyPagesCount(pageMode);
		const myCooperationPageCount = await $service.page.getCooperationPagesCount(pageMode);
		$helper.returnBody(true, {
			pages: pages,
			myPageCount: myPageCount,
			myCooperationPageCount: myCooperationPageCount
		})
	},
	/**
	 * 获取我的模板列表
	 * @returns {Promise<void>}
	 */
	async getMyTemplates(){
		const { ctx, $service, $helper } = app;
		let {pageMode} = ctx.request.query;
		const pages = await $service.page.getMyTemplates(pageMode);
		$helper.returnBody(true, pages)
	},
	/**
	 * 创建页面
	 * @returns {Promise<void>}
	 */
	async create(){
		const { ctx, $service, $helper } = app;
		let newPageData = ctx.request.body;
		const page = await $service.page.create(newPageData);
		$helper.returnBody(true, page)
	},
	/**
	 * 修改更新页面
	 * @returns {Promise<void>}
	 */
	async updatePage(){
		const { ctx, $service, $helper } = app;
		let {pageData} = ctx.request.body;
		await $service.page.update(pageData);
		$helper.returnBody(true)
	},
	/**
	 * 删除页面
	 */
	async deletePage() {
		const { ctx, $service, $helper } = app;
		let {id} = ctx.request.body;
		await $service.page.deletePage(id);
		$helper.returnBody(true)
	},
	/**
	 * 复制页面
	 * @returns {Promise<void>}
	 isPublish: false,
	 isTemplate: false,
	 members: [],
	 author: author,
	 */
	async copyPage(){
		const { ctx, $service, $helper } = app;
		let {id} = ctx.request.body;
		let page = await $service.page.getPageDetail(id);
		page._id = undefined;
		page.isPublish = false;
		page.isTemplate = false;
		page.members = [];
		let newPage = await $service.page.create(page);
		$helper.returnBody(true, {_id: newPage._id});
	},

	/**
	 *  发布页面
	 * @returns {Promise<void>}
	 */
	async publish(){
		const { ctx, $service, $helper } = app;
		let {id} = ctx.request.body;
		await $service.page.setPublish(id);
		$helper.returnBody(true);
	},
	/**
	 * 设为我的模板
	 * @returns {Promise<void>}
	 */
	async setTemplate(){
		const { ctx, $service, $helper } = app;
		let userData = ctx.userData
		let {id} = ctx.request.body;
		let page = await $service.page.getPageDetail(id);
		page = page.toObject();
		page._id = undefined;
		page.isPublish = false;
		page.isTemplate = true;
		page.members = [];
		page.author = userData._id;
		let newPage = await $service.page.create({...page});
		$helper.returnBody(true, {_id: newPage._id});
	},
	/**
	 * 获取模板市场所有模板
	 * @returns {Promise<void>}
	 */
	async getPublishTemplates(){
		const { ctx, $service, $helper } = app;
		let {pageMode} = ctx.request.query;
		const pages = await $service.page.getPublishTemplates(pageMode);
		$helper.returnBody(true, pages)
	},
	/**
	 * 获取页面详情
	 * @returns {Promise<void>}
	 */
	async pageDetail(){
		const { ctx, $service, $helper } = app;
		let {pageId} = ctx.request.query;
		const pageData = await $service.page.getPageDetail(pageId);
		$helper.returnBody(true, pageData)
	},
	/**
	 * 渲染页面
	 * @returns {Promise<void>}
	 */
	async view(){
		const { ctx, $service } = app;
		let pageId = ctx.params._id;
		const pageData = await $service.page.getPageDetail(pageId);
		let pageMode = {
			'h5': 'h5-swiper',
			'longPage': 'h5-long',
			'relativePage': 'h5-relative',
			'pc': 'pc'
		};
		ctx.status = 200;
		await ctx.render(pageMode[pageData.pageMode], {pageData: pageData})
	}
})
