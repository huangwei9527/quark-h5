const  fs = require('fs')
const path = require('path')
const crypto = require('crypto');
const jwt = require('jsonwebtoken')
module.exports = app => ({
	/**
	 * 返回客户端的内容
	 * @param status // 接口是否成功
	 * @param body // 返回数据
	 * @param msg // 返回信息提示
	 * @param code // 返回状态码
	 */
	returnBody (status = true, body = {}, msg = 'success', code = 200) {
		let {ctx} = app;
		ctx.status = code;
		ctx.body = {
			status: status,
			body: body,
			msg,
			code: code
		}
	},
	// 生成token
	async createToken(data) {
		let {$config} = app;
		return await jwt.sign(data, $config.jwt.secret, {expiresIn: 30* 24 * 60 * 60 + 's'});
	},
	// 验证token
	async checkToken(token) {
		let {$config} = app;
		return await jwt.verify(token, $config.jwt.secret)
	},
	// 加密
	async createPassword(password) {
		let {$config} = app;
		const hmac = crypto.createHash("sha256", $config.crypto.secret);
		hmac.update(password.toString());
		return hmac.digest("hex");
	},
	// 验证密码
	async checkPassword(password, hash_password) {
		// 先对需要验证的密码进行加密
		password = await this.createPassword(password);
		return password === hash_password;
	},
	// 检测目录是否存在，不存在则新建目录
	async dirExists(dir){
		let {$helper} = app;
		let isExists = await getStat(dir);
		//如果该路径且不是文件，返回true
		if (isExists && isExists.isDirectory()) {
			return true;
		} else if (isExists) {     //如果该路径存在但是文件，返回false
			return false;
		}
		//如果该路径不存在
		let tempDir = path.parse(dir).dir;      //拿到上级路径
		//递归判断，如果上级目录也不存在，则会代码会在此处继续循环执行，直到目录存在
		let status = await $helper.dirExists(tempDir);
		let mkdirStatus;
		if (status) {
			mkdirStatus = await mkdir(dir);
		}
		return mkdirStatus;
	}
});



/**
 * 读取路径信息
 * @param {string} path 路径
 */
function getStat(path) {
	return new Promise((resolve) => {
		fs.stat(path, (err, stats) => {
			if (err) {
				resolve(false);
			} else {
				resolve(stats);
			}
		})
	})
}

/**
 * 创建路径
 * @param {string} dir 路径
 */
function mkdir(dir) {
	return new Promise((resolve) => {
		fs.mkdir(dir, err => {
			if (err) {
				resolve(false);
			} else {
				resolve(true);
			}
		})
	})
}
