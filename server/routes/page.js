// 引入上一步创建的model
const mongoose = require('mongoose');
const Page = require('../models/page');
const router = require('koa-router')()
const fs = require('fs')
const path = require('path')


/**
 * 页面访问地址
 */
router.get('/view/:_id', async ctx=> {
	let _id = mongoose.mongo.ObjectId(ctx.params._id)
	let page = await Page.findOne({_id})
	ctx.status = 201;
	// todo 根据不同type渲染不同得模板引擎
	let pageMode = {
		'h5': 'h5-swiper',
		'longPage': 'h5-long',
		'relativePage': 'h5-relative',
		'pc': 'pc'
	}

	await ctx.render(pageMode[page.pageMode],{pageData: page})
})

/**
 * 获取所有page
 */
router.get('/myPages', async ctx=> {
	let author = ctx.state.user._id;
	author = mongoose.mongo.ObjectId(author)
	if(ctx.query.type === 'share'){
		ctx.body = await Page.find({pageMode: ctx.query.pageMode, isTemplate: { $ne: true }, members:{$elemMatch: {$in: author}}})
		return
	}
	ctx.body = await Page.find({author: author, pageMode: ctx.query.pageMode}).ne('isTemplate', true)
})

router.get('/myPages/count', async ctx => {
	let author = ctx.state.user._id;
	author = mongoose.mongo.ObjectId(author)
	let myList = await Page.find({pageMode: ctx.query.pageMode, author: author}).ne('isTemplate', true)
	let shareList = await Page.find({pageMode: ctx.query.pageMode, isTemplate: { $ne: true }, members:{$elemMatch: {$in: author}}})
	ctx.body = {
		my: myList.length,
		share: shareList.length
	}
})


/**
 * 查找某一页页面数据
 */
router.get('/detail/:_id', async ctx=> {
	let _id = mongoose.mongo.ObjectId(ctx.params._id)
	ctx.body = await Page.findOne({_id})
})

/**
 * 新增页面
 */
router.post('/add', async ctx=> {
	let data = ctx.request.body
	let author = ctx.state.user._id;
	ctx.body = await Page.create({
		...data,
		author: author,
		_id: mongoose.mongo.ObjectId()
	})
})

/**
 * 复制页面
 */
router.post('/copy/:_id', async ctx=> {
	let _id = mongoose.mongo.ObjectId(ctx.params._id)
	let author = ctx.state.user._id;
	let data = await Page.findOne({_id})
	ctx.body = await Page.create({
		...data.toObject(),
		isPublish: false,
		isTemplate: false,
		members: [],
		author: author,
		_id: mongoose.mongo.ObjectId()
	})
})

/**
 * 修改页面
 */
router.post('/update/:_id', async ctx=> {
	let _id = mongoose.mongo.ObjectId(ctx.params._id)
	let data = ctx.request.body
	ctx.body = await Page.updateOne({_id}, { $set: data }, {
		runValidators: true
	})
})

/**
 * 删除页面
 */
router.delete('/delete/:_id', async ctx=> {
	let _id = mongoose.mongo.ObjectId(ctx.params._id)
	ctx.body = await Page.deleteOne({_id})
})


/**
 * 设为模板
 */
router.post('/setTemplate/:_id', async ctx => {
	let _id = mongoose.mongo.ObjectId(ctx.params._id)
	let data = await Page.findOne({_id})
	ctx.body = await Page.create({
		...data.toObject(),
		isTemplate: true,
		isPublish: false,
		members: [],
		_id: mongoose.mongo.ObjectId()
	})
})

/**
 * 获取我的模板
 */
router.get('/myTemplate', async ctx=> {
	let author = ctx.state.user._id;
	author = mongoose.mongo.ObjectId(author)
	ctx.body = await Page.find({pageMode: ctx.query.pageMode, author: author}).where('isTemplate').equals(true).where('isPublish').equals(false)
})

/**
 * 发布页面
 */
router.post('/publish/:_id', async ctx=> {
	// let _id = mongoose.mongo.ObjectId(ctx.params._id)
	// ctx.body = await Page.updateOne({_id}, { $set: {isPublish: true} }, {
	// 	runValidators: true
	// })

	ctx.status = 202;
	ctx.body = '该功能暂不开放！'
})
/**
 * 添加协同开发人员
 */
router.post('/shareToUser/:_id', async ctx=> {
	let _id = mongoose.mongo.ObjectId(ctx.params._id)
	let data = ctx.request.body
	ctx.body = await Page.updateOne({_id}, { $push: {members: data.userIds} }, {
		runValidators: true
	})
})
/**
 * 删除协同开发人员
 */
router.post('/deleteShareToUser/:_id', async ctx=> {
	let _id = mongoose.mongo.ObjectId(ctx.params._id)
	let author = ctx.state.user._id;
	ctx.body = await Page.updateOne({_id}, { $pull: {members: author} }, {
		runValidators: true
	})
})

/**
 * 发布模板到模板市场
 */
router.post('/publishTemplate/:_id', async ctx=> {
	// let _id = mongoose.mongo.ObjectId(ctx.params._id)
	// let data = await Page.findOne({_id})
	// ctx.body = await Page.create({
	// 	...data.toObject(),
	// 	isTemplate: true,
	// 	isPublish: true,
	// 	members: [],
	// 	_id: mongoose.mongo.ObjectId()
	// })
	ctx.status = 202;
	ctx.body = '该功能暂不开放！'
})

/**
 * 获取模板市场模板列表
 */
router.get('/templateShop/list', async ctx=> {
	ctx.body = await Page.find({pageMode: ctx.query.pageMode}).where('isTemplate').equals(true).where('isPublish').equals(true)
})


module.exports = router
