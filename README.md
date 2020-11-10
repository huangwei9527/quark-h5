## 前言
想必你一定使用过易企秀或百度H5等微场景生成工具制作过炫酷的h5页面，除了感叹其神奇之处有没有想过其实现方式呢？本文从零开始实现一个H5编辑器项目完整设计思路和主要实现步骤，并开源前后端代码。有需要的小伙伴可以按照该教程从零实现自己的H5编辑器。（实现起来并不复杂，该教程只是提供思路，并非最佳实践）

演示地址：[传送门](http://47.104.247.183:4000/)

掘金文章：[Vue + Koa从零打造一个H5页面可视化编辑器——Quark-h5](https://juejin.im/post/6844903992426758152)

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
    |--confog					--------配置文件
    |--controller				--------数据库链接相关
    |--extend					--------框架扩展
    |--model					-------Schema和Model
    |--middleware				--------中间件
    |--core						--------Koa MVC实现自动加载核心文件
    |--views					--------ejs页面模板
    |--public					--------静态资源
    |--router.js				--------路由
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



**服务端具体接口实现就不详细介绍了，就是对页面的增删改查，和用户的登录注册难度不大**

## 本地开发
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

## 本地部署
需要全局安装pm2 
```
npm install pm2 -g
```
#### 启动命令
```
npm run start
```
启动完访问http://localhost:4000 就可以看到工程页面了




## 交流群(948547409)

### License
Apache License 2.0
