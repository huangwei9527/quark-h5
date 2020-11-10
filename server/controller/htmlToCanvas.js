/**
 * html2canvas所需接口相关
 * @type {request}
 */
const request = require('request');
module.exports = app => ({
	/**
	 * html2canvas 跨域接口设置
	 * @returns {Promise<void>}
	 */
	async corsproxy(){
		const {ctx} = app;
		const {url} = ctx.request.query;
		ctx.status = 200;
		ctx.body = await request(url)
	}
})
