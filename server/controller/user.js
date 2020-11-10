module.exports = app => ({
	/**
	 * 获取个人信息
	 * @returns {Promise<void>}
	 */
	async getUserInfo() {
		const { ctx, $helper } = app;
		$helper.returnBody(true, ctx.userData)
	},
	/**
	 * 更新个人昵称
	 * @returns {Promise<void>}
	 */
	async updateUserName(){
		const { ctx, $service, $helper } = app;
		const { name } = ctx.request.body
		const user = await $service.user.updateUserName(name);
		$helper.returnBody(true, user)
	},
	/**
	 * 更新个人昵称
	 * @returns {Promise<void>}
	 */
	async updateUserPass(){
		const { ctx, $service, $helper } = app;
		const userData = ctx.userData;
		const { oldPass, newPass } = ctx.request.body;
		// 校验老密码是否正确
		const userCurrentPass = await $service.user.getUsersPasswordByUsername(userData.username);
		const verifyPass = await $helper.checkPassword(oldPass, userCurrentPass.password)
		if (!verifyPass) {
			$helper.returnBody(false, '', "原密码错误，请输入正确原密码！");
			return;
		}
		const pass = await $helper.createPassword(newPass)
		const user = await $service.user.updateUserPass(pass);
		$helper.returnBody(true, user)
	},

	/**
	 * 更新个人头像
	 * @returns {Promise<void>}
	 */
	async updateUserAvatar(){
		const { ctx, $service, $helper } = app;
		let userData = ctx.userData;
		let file = ctx.request.files.file;
		let fileResult = await $service.file.upload(file, 'avatar/' + userData.username);
		const user = await $service.user.updateUserAvatar(fileResult.url);
		$helper.returnBody(true, user)
	},
	/**
	 * 模糊查询用户
	 * @returns {Promise<void>}
	 */
	async getUserList(){
		const { ctx, $service, $helper } = app;
		const { keywords } = ctx.request.query;
		const users = await $service.user.getUserByKeyWords(keywords);
		$helper.returnBody(true, users)
	}

})
