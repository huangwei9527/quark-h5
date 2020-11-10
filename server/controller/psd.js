/**
 * psd解析
 * @param app
 * @returns {{corsproxy(): Promise<void>}}
 */
const PSD = require('psd');
const path = require('path')
module.exports = app => ({
	/**
	 * 解析psd
	 * @returns {Promise<void>}
	 */
	async psdPpload(){
		const { ctx, $config, $helper } = app;
		let file = ctx.request.files.file;
		let psd = await PSD.open(file.path)
		let timeStr = + new Date();
		let descendantsList = psd.tree().descendants();
		descendantsList.reverse();
		let psdSourceList = []
		let currentPathDir = `/resource/upload_psd/${timeStr}`
		// 判断文件夹是否存在不存在则新建一个
		await $helper.dirExists(path.join(__dirname, '../public' + currentPathDir));
		// 遍历图层
		for (var i = 0; i < descendantsList.length; i++){
			if (descendantsList[i].isGroup()) continue;
			if (!descendantsList[i].visible) continue;
			try{
				await descendantsList[i].saveAsPng(path.join(__dirname, '../public' + currentPathDir + `/${i}.png`))
				psdSourceList.push({
					...descendantsList[i].export(),
					type: 'picture',
					imageSrc: ($config.baseUrl || '') + `${currentPathDir}/${i}.png`,
				})
			}catch (e) {
				// 转换不出来的图层先忽略
				continue;
			}
		}
		$helper.returnBody(true, {
			elements: psdSourceList,
			document: psd.tree().export().document
		})
	}
})
