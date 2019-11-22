const Koa = require('koa')
const render = require('koa-ejs');
const router = require('koa-router')()
const path = require('path')
const koaStatic = require('koa-static')
const koaBody = require('koa-body');
const cors = require('koa2-cors');
const koajwt = require('koa-jwt')
const jsonwebtoken = require('jsonwebtoken')
const mongoConf = require('./config/mongo');
const formatresponse = require('./middleware/formatresponse')
const fs =  require('fs')
const $config = require("../config")

const app = new Koa();
const SECRET = 'quark'; // 加密参数

//配置静态web
app.use(koaStatic(__dirname + '/public'), { gzip: true, setHeaders: function(res){
	res.header( 'Access-Control-Allow-Origin', '*')
}});
//跨域处理
app.use(cors());
/**
 * post接口数据处理
 */
app.use(koaBody({
	multipart: true,
	formidable: {
		maxFileSize: 3000*1024*1024    // 设置上传文件大小最大限制，默认30M
	}
}));


//配置ejs-template 模板引擎
render(app, {
	root: path.join(__dirname, 'views'),
	layout: false,
	viewExt: 'html',
	cache: false,
	debug: false
});

/**
 * 认证授权
 */
app.use(koajwt({ secret: SECRET}).unless({
	// 登录，注册接口不需要验证
	path: [
		/^\/common\/html2canvas\/corsproxy/, // 排除html2canvas跨域接口
		/^\/page\/view/,
		/^\/auth\/login/,
		/^\/auth\/register/
	]
}));

/**
 * 配置全局的变量
 */
router.use(async (ctx,next)=>{
	// token解密 将token里的用户信息赋值到全局变量中
	let token = ctx.headers.authorization
	if(token){
		ctx.state.user = jsonwebtoken.verify(token.split(' ')[1], SECRET);
	}
	// 全局变量
	ctx.state.BASE_URL = $config.baseURL;
	ctx.state.ROOT_PATH = path.join(__dirname, '../');
	ctx.state.SERVER_PATH = path.join(__dirname, './');
	ctx.state.SECRET = SECRET;
	await  next()
})

// 链接数据库
mongoConf.connect();


//配置路由
fs.readdirSync(path.join(__dirname,'./routes')).forEach(route=> {
	let api = require(`./routes/${route}`)
	router.use(`/${route.replace('.js', '')}`, api.routes())
})


app.use(formatresponse);

app.use(router.routes());   /*启动路由*/
app.use(router.allowedMethods());



//启动服务
app.listen($config.port);
