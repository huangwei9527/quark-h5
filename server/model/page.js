module.exports = app => {
	const { mongoose } = app;
	const Schema = mongoose.Schema
	// Schema
	const schema = new Schema({
		title:  { type: String, default: '未命名场景' },
		coverImage: { type: String, default: '' },
		description: { type: String, default: '我用夸克可视化编辑器做了一个超酷炫的H5，快来看看吧。' },
		shareConfig: {
			shareWx: false,
			coverImage: { type: String, default: '' },
			title:  { type: String, default: '这是#分享者#的大力推荐' },
			description: { type: String, default: '这是#分享者#大力推荐的H5' },
		},
		pages: Schema.Types.Mixed, //用于原始数据存储
		script:  { type: String, default: '' }, // 第三方脚本插件
		author: {
			type: String,
			ref: "user"
		},
		width: {type: Number, default: 375 }, // 页面宽
		height: {type: Number, default: 611 }, // 页面高度
		pageMode: {type: String, default: 'h5' }, // 渲染模式
		flipType: {type: Number, default: 0 }, // 翻页模式
		slideNumber: {type: Boolean, default: false }, // 翻页是否显示页码翻页指示
		add_time: Number,
		up_time: Number,
		status: { type: Number, enum: [0, 1], default: 1 }, // 0 不允许访问， 1 允许访问
		isPublish: {type: Boolean, default: false }, //  发布状态
		isTemplate: {type: Boolean, default: false },
		members: [{
			type: String,
			ref: "user"
		}], // 共享人员列表
		version: {
			type: Number,
			default: 1
		}
	}, {timestamps: {createdAt: 'created', updatedAt: 'updated'}})
	return  mongoose.model('page', schema);
};
