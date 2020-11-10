
let selectUserKey = {password:0};
module.exports = app => ({
	/**
	 * 新增用户
	 * @param options
	 * @returns {Promise<void>}
	 */
	async createUser(username, password, email, name) {
		const {$model} = app;
		await $model.user.create({
			username: username,
			password: password,
			email: email,
			name: name || username,
		});
		const query = {username: {$in: username}};
		return $model.user.findOne(query, selectUserKey).exec();
	},
	/**
	 * 根据用户名查找用户
	 * @param username
	 * @returns {Promise<void>}
	 */
	async getUsersByUsername(username){
		const {$model} = app;
		if (username.length === 0) {
			return null;
		}
		const query = {username: {$in: username}};
		return $model.user.findOne(query, selectUserKey).exec();
	},
	/**
	 * 根据用户名查找用户
	 * @param username
	 * @returns {Promise<void>}
	 */
	async getUsersPasswordByUsername(username){
		const {$model} = app;
		if (username.length === 0) {
			return null;
		}
		const query = {username: {$in: username}};
		return $model.user.findOne(query).select('password').exec();
	},
	/**
	 * 根据关键字，获取一组用户
	 * Callback:
	 * - err, 数据库异常
	 * - users, 用户列表
	 * @param {String} query 关键字
	 * @param {Object} opt 选项
	 * @return {Promise[users]} 承载用户列表的 Promise 对象
	 */
	async getUsersByQuery(query) {
		const {$model} = app;
		return $model.user.find(query, '', selectUserKey).exec();
	},
	/**
	 * 更新个人头像
	 * @param {*} url
	 */
	async updateUserAvatar(url){
		const {ctx, $model} = app;
		const userData = await ctx.userData
		await $model.user.findByIdAndUpdate(userData._id, {$set: {avatar: url}});
		return $model.user.findOne({ _id: userData._id }, selectUserKey).exec();
	},
	/**
	 * 更新用户昵称
	 * @param {*} name
	 */
	async updateUserName(name){
		const {ctx, $model} = app;
		const userData = await ctx.userData
		await $model.user.findByIdAndUpdate(userData._id, {$set: {name: name}});
		return $model.user.findOne({ _id: userData._id }, selectUserKey).exec();
	},
	/**
	 * 更新个人密码
	 * @param {*} newPass
	 */
	async updateUserPass(newPass){
		const {ctx, $model} = app;
		const userData = await ctx.userData
		await $model.user.findByIdAndUpdate(userData._id, {$set: {password: newPass}});
		return $model.user.findOne({ _id: userData._id }, selectUserKey).exec();
	},
	// 关键字模糊查询
	async getUserByKeyWords(keywords){
		const {$model} = app;
		return  await $model.user.find(
			{
				$or : [ //多条件，数组
					{name : {$regex : keywords}},
					{username : {$regex : keywords}},
					{email : {$regex : keywords}}
				]
			},
			{
				password: 0
			},
			{
				sort : { _id : -1 },
				limit : 20
			}
		)
	}
});
