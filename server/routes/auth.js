// 引入上一步创建的model
const mongoose = require('mongoose');
const Users = require('../models/user');
const router = require('koa-router')();
const jsonwebtoken = require('jsonwebtoken')

/**
 * 用户登录
 */
router.post('/login', async ctx=> {
	let data = ctx.request.body
	let result = await Users.findOne({username: data.username}).select('username _id password').exec();
	if(!result){
		ctx.status = 202;
		ctx.body = '用户尚未注册，请先注册'
		return
	}
	if(result.password !== data.password){
		ctx.status = 202;
		ctx.body = '密码错误'
		return
	}
	let userToken = {name: result.username, _id: result._id};
	ctx.body = {
		token: jsonwebtoken.sign(userToken, ctx.state.SECRET,  {expiresIn: '24h'})
	}
})
/**
 * 注册
 */
router.post('/register', async ctx=> {
	let data = ctx.request.body
	let result = await Users.findOne({username: data.username});
	if(result){
		ctx.status = 202;
		ctx.body = '用户已注册，请直接登陆'
		return
	}
	let userData = await Users.create({
		...data,
		_id: mongoose.mongo.ObjectId()
	})
	let userToken = {name: userData.username, _id: userData._id};
	ctx.body = {
		token: jsonwebtoken.sign(userToken, ctx.state.SECRET,  {expiresIn: '24h'})
	}
})


module.exports = router
