
module.exports = app => ({
	/**
	 * 获取我的图片列表
	 * @returns {Promise<*>}
	 */
	async getMyImages(){
		const {ctx, $model} = app;
		let userData = ctx.userData
		let query = { author: userData._id};
		return await $model.image.find(query).select('_id url').exec();
	},
	/**
	 * 添加图片
	 * @param url
	 * @returns {Promise<*>}
	 */
	async addImage(url){
		const {ctx, $model} = app;
		let userData = ctx.userData;
		return await $model.image.create({
			author: userData._id,
			url: url
		});
	}
})
