
const router=require('koa-router')();
const PSD = require('psd');
const fs = require('fs')
const request = require('request');
const path = require('path')
const Image = require('../models/image');
const mongoose = require('mongoose');
const uploadImage = require('../utils/uploadImg')

/**
 * 上传psd
 */
router.post('/psdPpload',async ctx=>{
	const file = ctx.request.files.file; // 获取上传文件
	let psd = await PSD.open(file.path)
	var timeStr = + new Date();
	let descendantsList = psd.tree().descendants();
	descendantsList.reverse();
	let psdSourceList = []
	let currentPathDir = `public/upload_static/psd_image/${timeStr}`
	fs.existsSync(path.join(ctx.state.SERVER_PATH, currentPathDir)) || fs.mkdirSync(path.join(ctx.state.SERVER_PATH, currentPathDir))
	for (var i = 0; i < descendantsList.length; i++){
		if (descendantsList[i].isGroup()) continue;
		if (!descendantsList[i].visible) continue;
		try{
			await descendantsList[i].saveAsPng(path.join(ctx.state.SERVER_PATH, currentPathDir + `/${i}.png`))
			psdSourceList.push({
				...descendantsList[i].export(),
				type: 'picture',
				imageSrc: ctx.state.BASE_URL + `/upload_static/psd_image/${timeStr}/${i}.png`,
			})
		}catch (e) {
			// 转换不出来的图层先忽略
			continue;
		}
	}
	ctx.body = {
		elements: psdSourceList,
		document: psd.tree().export().document
	};
})

/**
 * html2canvas 跨域接口设置
 */
router.get('/html2canvas/corsproxy', async ctx => {
	ctx.status = 201;
	ctx.body =  await request(ctx.query.url)
})

/**
 * 上传文件
 */
router.post('/uploadFile', async ctx => {
	//imageUrl
	let imageUrl = uploadImage(ctx)
	ctx.body =imageUrl
});


module.exports = router
