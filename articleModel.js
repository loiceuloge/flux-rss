const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const articleSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			trim: true,
			required: true,
		},
		image: { type: String },
		description: { type: String, required: true },
		published: {
			type: String,
		},
		link: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

articleSchema.plugin(mongoosePaginate);

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
