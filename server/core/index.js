/**
 * 封装koa mvc基础架构初始化工作
 */
const path = require('path')
const Koa = require('koa');
const { initConfig, initController, initService, initModel, initRouter, initMiddleware, initExtend, initSchedule }  = require('./loader');
class Application{
	constructor(){
		this.$app = new Koa();
		// 注册默认内置中间件
		this.initDefaultMiddleware();

		// 初始化config
		this.$config = initConfig(this);
		// 初始化controller
		this.$controller = initController(this);
		// 初始化service
		this.$service = initService(this);
		// 初始化middleware
		this.$middleware = initMiddleware(this);
		// 初始化model
		this.$model = initModel(this)
		// 初始化router
		this.$router = initRouter(this);
		// 初始化扩展
		initExtend(this);
		// 初始化定时任务schedule
		initSchedule(this)

		// 将ctx注入到app上
		this.$app.use(async (ctx, next) => {
			this.ctx = ctx;
			await next()
		})
		this.$app.use(this.$router.routes());
	}

	// 设置内置中间件
	initDefaultMiddleware(){
		const koaStatic = require('koa-static');
		const koaBody = require('koa-body');
		const cors = require('koa2-cors');
		const views = require('koa-views');

		// 配置静态web
		this.$app.use(koaStatic(path.resolve(__dirname, '../public')), { gzip: true, setHeaders: function(res){
				res.header( 'Access-Control-Allow-Origin', '*')
			}});
		//跨域处理
		this.$app.use(cors());
		// body接口数据处理
		this.$app.use(koaBody({
			multipart: true,
			formidable: {
				maxFileSize: 3000*1024*1024    // 设置上传文件大小最大限制，默认30M
			}
		}));
		//配置需要渲染的文件路径及文件后缀
		this.$app.use(views(path.join(__dirname,'../views'), {
			extension:'ejs'
		}))
	}

	// 启动服务
	start(port){
		this.$app.listen(port, ()=>{
			console.log('server is starting........!');
		});
	}
}

module.exports = Application;
