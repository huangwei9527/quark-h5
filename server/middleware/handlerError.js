module.exports = app => {
	return async function(ctx, next) {
		try {
			await next();
		} catch (err) {
			console.log(err)
			const status = err.status || 500;
			// 如果时生产环境的时候 500错误的详细错误内容不返回给客户端
			const error = status === 500 ? '网络错误' : err.message;

			ctx.body = {
				msg: error,
				status: false,
				body: {},
				code: status
			};
		}
	};
};
