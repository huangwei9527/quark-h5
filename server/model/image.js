module.exports = app => {
	const { mongoose } = app;
	const Schema = mongoose.Schema
	// Schema
	const schema = new Schema({
		url:  { type: String, default: '' },
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user'
		}
	}, {timestamps: {createdAt: 'created', updatedAt: 'updated'}})
	return  mongoose.model('image', schema);
};
