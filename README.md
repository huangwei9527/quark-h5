#  夸克 H5
夸克H5是一款基于WEB的 H5制作工具。让不会写代码的人也能轻松快速上手制作H5页面。类似[易企秀](http://www.eqxiu.com/)、[百度 H5](https://h5.baidu.com)的H5制作、建站工具
### 技术栈
> 前端
>> vue2 + vue-router + vuex
>服务端
>> Koa2 + mongodb

### Demo
> http://47.104.247.183:4000

### 功能演示
gif图比较大，加载比较慢

![预览](https://raw.githubusercontent.com/huangwei9527/quark-h5/master/docs/images/quark.gif)


## 安装依赖
这里切记。使用 `cnpm install` 安装依赖。
```bash
cnpm install
```

### 修改mongodb配置
```
{
  "port": "4000",
  "adminAccount": "admin",
  "db": {
    "servername": "localhost",
    "DATABASE": "admin",
    "port": 27017,
    "user": "admin",
    "pass": "admin",
    "authSource": "admin"
  },
  "baseURL": "http://localhost:4000"
}
```

### 开发

```bash
npm run dev
```

### 构建

构建前端版本

```bash
npm run build-client
```

构建渲染模板

```bash
npm run lib:h5-swiper
```


### 技术实现和教程
待完善


### Features
1. 编辑器
    - [x] 拖拽改变组件形状
    - [x] 元素: 复制（画布）
    - [x] 元素: 删除（画布）
    - [x] 元素: 编辑（画布）
    - [x] 页面：新增
    - [x] 页面：复制
    - [x] 页面：删除
    - [x] 快速预览
    - [x] 撤销、重做

2. 基础组件
    - [x] 文字
    - [x] 普通按钮
    - [x] 图形
    - [x] 普通图片
    - [x] 轮播图
    - [x] iframe组件
	...
3. 表单组件
    - [ ] 单行文本
    - [ ] 多行文本
    - [ ] 单选
    - [ ] 多选
    - [ ] 下拉选框
    - [ ] 时间
    - [ ] 日期
	...
3. 功能组件
	- [x] 单行文本音乐组件
	...
4. 编辑器功能
    - [x] 页面编辑预览发布
    - [x] 元素添加动画
    - [x] 元素添加事件
    - [x] 上传 PSD，一键转换为 H5
    - [x] 自定义脚本(参考百度h5)
    - [ ] 长页h5
    - [ ] PC页面
    - [ ] 组件group
    - [ ] 多组件合组件
    - [ ] 吸附线

### 更多说明

#### 前端组件说明
1. 组件以`qk-`为前缀，位置：`client/plugins`


#### 技术栈（当前）
1. 前端：[Vue.js](https://vuejs.org/v2/guide/)
2. 后端：[Koa](https://strapi.io/)
3. 存储：[mongodb](https://mongodb.com)

## 开源协议

本项目依据MIT开源协议发布，允许任何组织和个人免费使用。
