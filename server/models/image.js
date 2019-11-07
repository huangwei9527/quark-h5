const mongoose = require('mongoose');
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

// Schema
const schema = new Schema({
	_id: { type: ObjectId }, // 默认生成，不加也可以
	url:  { type: String, default: '' },
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
	}
})

// Model
const model = mongoose.model('image', schema, 'image');

module.exports = model;
