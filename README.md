## 前言
想必你一定使用过易企秀或百度H5等微场景生成工具制作过炫酷的h5页面，除了感叹其神奇之处有没有想过其实现方式呢？本文从零开始实现一个H5编辑器项目完整设计思路和主要实现步骤，并开源前后端代码。有需要的小伙伴可以按照该教程从零实现自己的H5编辑器。（实现起来并不复杂，该教程只是提供思路，并非最佳实践）

Github: [传送门](https://github.com/huangwei9527/quark-h5)<br/>
演示地址：[传送门](http://47.104.247.183:4000/)

**编辑器预览：**

![](https://user-gold-cdn.xitu.io/2019/11/10/16e55daeaa08bd25?w=1733&h=816&f=gif&s=4898484)

## 技术栈
**前端：**<br/>
`vue`: 模块化开发少不了angular，react，vue三选一，这里选择了vue。<br/>
`vuex`: 状态管理<br/>
`sass`: css预编译器。<br/>
`element-ui`：不造轮子，有现成的优秀的vue组件库当然要用起来。没有的自己再封装一些就可以了。<br/>
`loadsh`：工具类<br/>

**服务端：**<br/>
`koa`：后端语言采用nodejs，koa文档和学习资料也比较多，express原班人马打造，这个正合适。<br/>
`mongodb`：一个基于分布式文件存储的数据库，比较灵活。<br/>
## 阅读前准备
1、了解vue技术栈开发<br/>
2、了解koa<br/>
3、了解mongodb<br/>
## 工程搭建
**基于vue-cli3环境搭建**<br/>
- 如何规划好我们项目的目录结构？首先我们需要有一个目录作为前端项目，一个目录作为后端项目。所以我们要对vue-cli 生成的项目结构做一下改造：

```
···
·
|-- client				// 原 src 目录，改成 client 用作前端项目目录
|-- server				// 新增 server 用于服务端项目目录
|-- engine-template		// 新增 engine-template 用于页面模板库目录
|-- docs				// 新增 docs 预留编写项目文档目录
·
···
```
- 这样的话 我们需要再把我们webpack配置文件稍作一下调整，首先是把原先的编译指向src的目录改成client，其次为了 npm run build 能正常编译 client 我们也需要为 babel-loader 再增加一个编译目录：

  - 根目录新增vue.config.js,目的是为了改造项目入口,改为:client/main.js
    ```
        module.exports = {    
          pages: {        
            index: {            
              entry: "client/main.js"        
            }    
          }
        }
    ```
  - babel-loader能正常编译 client, engine-template目录， 在vue.config.js新增如下配置

	```
	// 扩展 webpack 配置
	chainWebpack: config => {
    	config.module
    	.rule('js')
    	.include.add(/engine-template/).end()
    	.include.add(/client/).end()
    	.use('babel')
    	.loader('babel-loader')
    	.tap(options => {
    	// 修改它的选项...
    	return options
    	})
	}
	```
这样我们搭建起来一个简易的项目目录结构。

## 工程目录结构

```
|-- client					--------前端项目界面代码
    |--common					--------前端界面对应静态资源
    |--components				--------组件
    |--config					--------配置文件
    |--eventBus					--------eventBus
    |--filter					--------过滤器
    |--mixins					--------混入
    |--pages					--------页面
    |--router					--------路由配置
    |--store					--------vuex状态管理
    |--service					--------axios封装
    |--App.vue					--------App
    |--main.js					--------入口文件
    |--permission.js			--------权限控制
|-- server					--------服务器端项目代码
    |--confog					--------数据库链接相关
    |--middleware				--------中间件
    |--models					--------Schema和Model
    |--routes					--------路由
    |--views					--------ejs页面模板
    |--public					--------静态资源
    |--utils					--------工具方法
    |--app.js					--------服务端入口
|-- common					--------前后端公用代码模块（如加解密）
|-- engine-template			--------页面模板引擎，使用webpack打包成js提供页面引用
|-- docs					--------预留编写项目文档目录
|-- config.json				--------配置文件
```
## 前端编辑器实现
编辑器的实现思路是：编辑器生成页面JSON数据，服务端负责存取JSON数据，渲染时从服务端取数据JSON交给前端模板处理。

![](https://user-gold-cdn.xitu.io/2019/11/11/16e582f5b9c69601?w=747&h=435&f=jpeg&s=31027)

## 数据结构
确认了实现逻辑，数据结构也是非常重要的，把一个页面定义成一个JSON数据，数据结构大致是这样的：

**页面工程数据接口**
```
{
	title: '', // 标题
	description: '', //描述
	coverImage: '', // 封面
	auther: '', // 作者
	script: '', // 页面插入脚本
	width: 375, // 高
	height: 644, // 宽
	pages: [], // 多页页面
	shareConfig: {}, // 微信分享配置
	pageMode: 0, // 渲染模式，用于扩展多种模式渲染，翻页h5/长页/PC页面等等
}
```
**多页页面pages其中一页数据结构：**
```
{
	name: '',
	elements: [], // 页面元素
	commonStyle: {
		backgroundColor: '',
		backgroundImage: '',
		backgroundSize: 'cover'
	},
	config: {}
}
```
**元素数据结构：**
```
{
	elName: '', // 组件名
	animations: [], // 图层的动画,可以支持多个动画
	commonStyle: {}, // 公共样式，默认样式
	events: [], // 事件配置数据，每个图层可以添加多个事件
	propsValue: {}, // 属性参数
	value: '', // 绑定值
	valueType: 'String', // 值类型
	isForm: false // 是否是表单控件，用于表单提交时获取表单数据
}
```
### 编辑器整体设计
- 一个组件选择区，提供使用者选择需要的组件
- 一个编辑预览画板，提供使用者拖拽排序页面预览的功能
- 一个组件属性编辑，提供给使用者编辑组件内部props、公共样式和动画的功能
**如图：**

![](https://user-gold-cdn.xitu.io/2019/11/11/16e58647221d6942?w=1920&h=903&f=png&s=204235)
用户在左侧组件区域选择组件添加到页面上，编辑区域通过动态组件特性渲染出每个元素组件。

`最后，点击保存将页面数据提交到数据库。至于数据怎么转成静态 HTML方法有很多。还有页面数据我们全部都有，我们可以做页面的预渲染，骨架屏，ssr，编译时优化等等。而且我们也可以对产出的活动页做数据分析~有很多想象的空间。`

### 核心代码
编辑器核心代码，基于 Vue 动态组件特性实现：

![](https://user-gold-cdn.xitu.io/2019/11/11/16e586d0f77fe59a?w=1120&h=340&f=png&s=49296)

为大家附上 Vue 官方文档：[cn.vuejs.org/v2/api/#is](https://cn.vuejs.org/v2/api/#is "cn.vuejs.org/v2/api/#is")
### 画板元素渲染
编辑画板只需要循环遍历pages[i].elements数组，将里面的元素组件JSON数据取出，通过动态组件渲染出各个组件，支持拖拽改变位置尺寸.

### 元素组件管理
在client目录新建plugins来管理组件库。也可以将该组件库发到npm上工程中通过npm管理

#### 组件库
编写组件，考虑的是组件库，所以我们竟可能让我们的组件支持全局引入和按需引入，如果全局引入，那么所有的组件需要要注册到Vue component 上，并导出：

**client/plugins下新建index.js入口文件**

    ```
	/**
     * 组件库入口
     * */
    import Text from './text'
    // 所有组件列表
    const components = [
    	Text
    ]
    // 定义 install 方法，接收 Vue 作为参数
    const install = function (Vue) {
    	// 判断是否安装，安装过就不继续往下执行
    	if (install.installed) return
    	install.installed = true
    	// 遍历注册所有组件
    	components.map(component => Vue.component(component.name, component))
    }
    
    // 检测到 Vue 才执行，毕竟我们是基于 Vue 的
    if (typeof window !== 'undefined' && window.Vue) {
    	install(window.Vue)
    }

    export default {
    	install,
    	// 所有组件，必须具有 install，才能使用 Vue.use()
    	Text
    }
	```
	
#### 组件开发
示例： text文本组件

**client/plugins下新建text组件目录**
```
|-- text                --------text组件
    |--src              --------资源
    	|--index.vue    --------组件
    |--index.js         --------入口
```
text/index.js
```
// 为组件提供 install 方法，供组件对外按需引入
import Component from './src/index'
Component.install = Vue => {
	Vue.component(Component.name, Component)
}
export default Component
```
text/src/index.vue
```
<!--text.vue-->
<template>
  <div class="qk-text">
    {{text}}
  </div>
</template>

<script>
	export default {
		name: 'QkText', // 这个名字很重要，它就是未来的标签名<qk-text></qk-text>
		props: {
			text: {
				type: String,
				default: '这是一段文字'
      		}
		}
	}
</script>

<style lang="scss" scoped>
</style>
```

**编辑器里使用组件库：**
```
// 引入组件库
import QKUI from 'client/plugins/index'
// 注册组件库
Vue.use(QKUI)

// 使用：
<qk-text text="这是一段文字"></qk-text>
```
按照这个组件开发方式我们可以扩展任意多的组件，来丰富组件库

`需要注意的是这里的组件最外层宽高都要求是100%`

#### 配置文件
Quark-h5编辑器左侧选择组件区域可以通过一个配置文件定义可选组件
新建一个ele-config.js配置文件：
```
export default [
	{
		title: '基础组件',
		components: [
			{
				elName: 'qk-text', // 组件名，与组件库名称一致
				title: '文字',
				icon: 'iconfont iconwenben',
				// 给每个组件配置默认显示样式
				defaultStyle: {
					height: 40
				}
			}
		]
	},
	{
		title: '表单组件',
		components: []
	},
	{
		title: '功能组件',
		components: []
	},
	{
		title: '业务组件',
		components: []
	}
]
```

公共方法中提供一个function 通过组件名和默认样式获取元素组件JSON，getElementConfigJson(elName, defaultStyle)方法



### 元素属性编辑
#### 公共属性样式编辑
公共样式属性编辑比较简单就是对元素JSON对象commonStyles字段进行编辑操作
#### props属性编辑
1.为组件的每一个prop属性开发一个属性编辑组件. 例如：QkText组件需要text属性，新增一个attr-qk-text组件来操作该属性
2.获取组件prop对象
3.遍历prop对象key, 通过key判断显示哪些属性编辑组件
### 元素添加动画实现
动画效果引入Animate.css动画库。元素组件动画,可以支持多个动画。数据存在元素JSON对象animations数组里。
#### 选择面板hover预览动画
![](https://user-gold-cdn.xitu.io/2019/11/11/16e596162029891d?w=457&h=452&f=gif&s=103928)
监听mouseover和mouseleave，当鼠标移入时将动画className添加入到元素上，鼠标移出时去掉动画lassName。这样就实现了hover预览动画
#### 编辑预览动画
组件编辑时支持动画预览和单个动画预览。
![](https://user-gold-cdn.xitu.io/2019/11/11/16e5965a19adb15e?w=448&h=170&f=png&s=5636)
封装一个动画执行方法
```
/**
 * 动画方法， 将动画css加入到元素上，返回promise提供执行后续操作（将动画重置）
 * @param $el 当前被执行动画的元素
 * @param animationList 动画列表
 * @param isDebugger 动画列表
 * @returns {Promise<void>}
 */
export default async function runAnimation($el, animationList = [], isDebug , callback){
	let playFn = function (animation) {
		return new Promise(resolve => {
			$el.style.animationName =  animation.type
			$el.style.animationDuration =  `${animation.duration}s`
			// 如果是循环播放就将循环次数置为1，这样有效避免编辑时因为预览循环播放组件播放动画无法触发animationend来暂停组件动画
			$el.style.animationIterationCount =  animation.infinite ? (isDebug ? 1 : 'infinite') : animation.interationCount
			$el.style.animationDelay =  `${animation.delay}s`
			$el.style.animationFillMode =  'both'
			let resolveFn = function(){
				$el.removeEventListener('animationend', resolveFn, false);
				$el.addEventListener('animationcancel', resolveFn, false);
				resolve()
			}
			$el.addEventListener('animationend', resolveFn, false)
			$el.addEventListener('animationcancel', resolveFn, false);
		})
	}
	for(let i = 0, len = animationList.length; i < len; i++){
		await playFn(animationList[i])
	}
	if(callback){
		callback()
	}
}
```

`animationIterationCount 如果是编辑模式的化动画只执行一次，不然无法监听到动画结束animationend事件`

执行动画前先将元素样式style缓存起来，当动画执行完再将原样式赋值给元素
```
let cssText = this.$el.style.cssText;
runAnimations(this.$el, animations, true, () => {
	this.$el.style.cssText = cssText
})
```

### 元素添加事件
提供事件mixins混入到组件，每个事件方法返回promise，元素被点击时按顺序执行事件方法

### 页面插入js脚本
参考百度H5，将脚本以script标签形式嵌入。页面加载后执行。
这里也可以考虑mixins方式混入到页面或者组件，可根据业务需求自行扩展，都是可以实现的。
### redo/undo历史操作纪录

1. 历史操作纪录存在状态机store.state.editor.historyCache数组中。
2. 每次修改编辑操作都把整个pageDataJson字段push到historyCache
3. 点击redo/undo时根据index获取到pageDataJson重新渲染页面

### psd设计图导入生成h5页面
将psd每个设计图中的每个图层导出成图片保存到静态资源服务器中，

**服务端安装psd依赖**

```
cnpm install psd --save
```
**加入psd.js依赖，并且提供接口来处理数据**
```
var PSD = require('psd');
router.post('/psdPpload',async ctx=>{
	const file = ctx.request.files.file; // 获取上传文件
	let psd = await PSD.open(file.path)
	var timeStr = + new Date();
	let descendantsList = psd.tree().descendants();
	descendantsList.reverse();
	let psdSourceList = []
	let currentPathDir = `public/upload_static/psd_image/${timeStr}`
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
```
**最后把获取的数据转义并返回给前端，前端获取到数据后使用系统统一方法，遍历添加统一图片组件**

- psd源文件大小最好不要超过30M，过大会导致浏览器卡顿甚至卡死
- 尽可能合并图层，并栅格化所有图层
- 较复杂的图层样式，如滤镜、图层样式等无法读取

### html2canvas生成缩略图
这里只需要注意下图片跨域问题，官方提供html2canvas: proxy解决方案。它将图片转化为base64格式，结合使用设置(proxy: theProxyURL), 绘制到跨域图片时，会去访问theProxyURL下转化好格式的图片，由此解决了画布污染问题。
提供一个跨域接口
```
/**
 * html2canvas 跨域接口设置
 */
router.get('/html2canvas/corsproxy', async ctx => {
	ctx.body =  await request(ctx.query.url)
})
```

## 渲染模板
### 实现逻辑
在engine-template目录下新建swiper-h5-engine页面组件，这个组件接收到页面JSON数据就可以把页面渲染出来。跟编辑预览画板实现逻辑差不多。

然后使用vue-cli库打包命令将组件打包成engine.js库文件。ejs模板引入该页面组件配合json数据渲染出页面

![](https://user-gold-cdn.xitu.io/2019/11/11/16e59c83f8b1c456?w=799&h=496&f=jpeg&s=42423)
### 适配方案
提供两种方案解决屏幕适配
1、等比例缩放
在将json元素转换为dom元素的时候，对所有的px单位做比例转换，转换公式为 new = old * windows.x / pageJson.width，这里的pageJson.width是页面的一个初始值，也是编辑时候的默认宽度，同时viewport使用device-width。 
2.全屏背景， 页面垂直居中
因为会存在上下或者左右有间隙的情况，这时候我们把背景颜色做全屏处理

`页面垂直居中只适用于全屏h5, 以后扩展长页和PC页就不需要垂直居中处理。`
### 模板打包
package.json中新增打包命令

`"lib:h5-swiper": "vue-cli-service build --target lib --name h5-swiper --dest server/public/engine_libs/h5-swiper engine-template/engine-h5-swiper/index.js"`

执行npm run lib:h5-swiper 生成引擎模板js如图

![](https://user-gold-cdn.xitu.io/2019/11/11/16e59d256c29c46c?w=464&h=185&f=jpeg&s=12180)

### 页面渲染
ejs中引入模板

`<script src="/third-libs/swiper.min.js"></script>`

使用组件

`<engine-h5-swiper :pageData="pageData"  />`

## 后端服务
### 初始化项目
工程目录上文已给出，也可以使用 koa-generator 脚手架工具生成
### ejs-template 模板引擎配置
app.js
```
//配置ejs-template 模板引擎
render(app, {
	root: path.join(__dirname, 'views'),
	layout: false,
	viewExt: 'html',
	cache: false,
	debug: false
});
```
### koa-static静态资源服务
因为html2canvas需要图片允许跨域，所以在静态资源服务中所有资源请求设置'Access-Control-Allow-Origin':'*'


app.js
```
//配置静态web
app.use(koaStatic(__dirname + '/public'), { gzip: true, setHeaders: function(res){
	res.header( 'Access-Control-Allow-Origin', '*')
}});
```
### 修改路由的注册方式，通过遍历routes文件夹读取文件

app.js
```
const fs =  require('fs')
fs.readdirSync(path.join(__dirname,'./routes')).forEach(route=> {
    let api = require(`./routes/${route}`)
    app.use(api.routes(), api.allowedMethods())
})
```

### 添加jwt认证，同时过滤不需要认证的路由，如获取token

app.js
```
const jwt = require('koa-jwt')
app.use(jwt({ secret: 'yourstr' }).unless({
    path: [
        /^\/$/, /\/token/, /\/wechat/,
        { url: /\/papers/, methods: ['GET'] }
    ]
}));
```
### 中间件实现统一接口返回数据格式，全局错误捕获并响应
middleware/formatresponse.js
```
module.exports = async (ctx, next) => {
	await next().then(() => {
		if (ctx.status === 200) {
			ctx.body = {
				message: '成功',
				code: 200,
				body: ctx.body,
				status: true
			}
		} else if (ctx.status === 201) { // 201处理模板引擎渲染

		} else {
			ctx.body = {
				message: ctx.body || '接口异常，请重试',
				code: ctx.status,
				body: '接口请求失败',
				status: false
			}
		}
	}).catch((err) => {
		if (err.status === 401) {
			ctx.status = 401;
			ctx.body = {
				code: 401,
				status: false,
				message: '登录过期，请重新登录'
			}
		} else {
			throw err
		}
	})
}

```
### koa2-cors跨域处理
当接口发布到线上，前端通过ajax请求时，会报跨域的错误。koa2使用koa2-cors这个库非常方便的实现了跨域配置，使用起来也很简单
```
const cors = require('koa2-cors');
app.use(cors());
```
### 连接数据库
我们使用mongodb数据库，在koa2中使用mongoose这个库来管理整个数据库的操作。

- 创建配置文件 

根目录下新建config文件夹，新建mongo.js
```
// config/mongo.js
const mongoose = require('mongoose').set('debug', true);
const options = {
    autoReconnect: true
}

// username 数据库用户名
// password 数据库密码
// localhost 数据库ip
// dbname 数据库名称
const url = 'mongodb://username:password@localhost:27017/dbname'

module.exports = {
    connect: ()=> {            
        mongoose.connect(url,options)
        let db = mongoose.connection
        db.on('error', console.error.bind(console, '连接错误:'));
        db.once('open', ()=> {
            console.log('mongodb connect suucess');
        })
    }
}
```
把mongodb配置信息放到config.json中统一管理
- 然后在app.js中引入
```
const mongoConf = require('./config/mongo');
mongoConf.connect();
```
...
**服务端具体接口实现就不详细介绍了，就是对页面的增删改查，和用户的登录注册难度不大**

## 启动运行
### 启动前端
```
npm run dev-client
```
### 启动服务端
```
npm run dev-server
```

注意：
如果没有生成过引擎模板js文件的，需要先编辑引擎模板，否则预览页面加载页面引擎.js 404报错
##### 编译engine.js模板引擎
```
npm run lib:h5-swiper
```




## 交流群(948547409)
![QQ群聊](http://chuantu.xyz/t6/703/1574060179x992245975.png)

### License
Apache License 2.0
