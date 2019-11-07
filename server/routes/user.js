// 引入上一步创建的model
const mongoose = require('mongoose');
const Users = require('../models/user');
const router = require('koa-router')()

router.get('/list', async ctx=> {
	ctx.body = await Users.find()
})

/**
 * 获取user用户信息
 */
router.get('/info', async ctx=> {
	let _id = ctx.state.user._id
	ctx.body = await Users.findOne({_id}).select('username name email avatar type roles').exec();
})
/**
 * 关键字查询用户列表
 */
router.get('/list/search', async ctx=> {
	let keywords = ctx.request.keywords
	const reg = new RegExp(keywords, 'i');
	ctx.body = await Users.find().where('username').regex(reg).where('name').regex(reg)
})

// 创建用户
router.post('/', async ctx=> {
	let data = ctx.request.body
	let result = await Users.create({
		...data,
		_id: mongoose.mongo.ObjectId()
	})
	ctx.body = result.select('username name email avatar type roles').exec();
})
/**
 * 用户登录
 */
router.post('/login', async ctx=> {
	let data = ctx.request.body
	let result = await Users.findOne({username: data.username}).select('username password').exec();
	if(!result){
		ctx.status = 202;
		ctx.body = '用户尚未注册，请先注册'
	}
	if(result.password !== data.password){
		ctx.status = 202;
		ctx.body = '密码错误'
	}
	ctx.body = result
})

/**
 * 修改更新用户信息
 */
router.post('/:_id', async ctx=> {
	let _id = mongoose.mongo.ObjectId(ctx.params._id)
	let data = ctx.request.body
	let result = await Users.update({_id}, { $set: data }, {
		runValidators: true
	})
	ctx.body = result.select('username name email avatar type roles').exec();
})

router.delete('/:_id', async ctx=> {
	let _id = mongoose.mongo.ObjectId(ctx.params._id)
	ctx.body = await Users.deleteOne({_id})
})


module.exports = router
