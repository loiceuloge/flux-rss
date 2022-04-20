const Joi = require('joi');
const Article = require('./articleModel');

const pagination = Joi.object({
	page: Joi.number().integer().default(1),
	limit: Joi.number().integer().default(5),
	getAll: Joi.boolean().default(false),
});

const getData = async (req, res) => {
	try {
		const { getAll = false, page = 1, limit = 20 } = await pagination.validateAsync(req.body);

		let options = {};

		if (getAll) {
			res.json({
				data: await Article.find(options),
				pagination: {
					limit: 0,
					page: 0,
					count: 0,
					hasNextPage: false,
					hasPrevPage: false,
				},
			});
		} else {
			const { count, data, hasNextPage, hasPrevPage } = await Article.paginate(options, {
				customLabels: {
					totalDocs: 'count',
					docs: 'data',
					limit: 'perPage',
				},
				sort: { createdAt: -1 },
				page,
				limit,
			});

			res.json({
				data,
				pagination: {
					limit,
					page,
					count,
					hasNextPage,
					hasPrevPage,
				},
			});
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const editSchema = Joi.object({
	id: Joi.string().required().messages({
		'any.required': 'id inexistant!',
	}),
	title: Joi.string().optional().trim().min(3).messages({
		'string.empty': 'empty',
		'string.min': '3 caractères minimun',
	}),
	description: Joi.string().optional().trim().min(3).messages({
		'string.empty': 'empty',
		'string.min': '3 caractères minimun',
	}),
});

const editData = async (req, res) => {
	console.log(req.body);
	try {
		const { id, ...values } = await editSchema.validateAsync({
			...req.body,
			id: req.params.id,
		});

		const article = await Article.findById(id);

		if (!article) {
			throw new Error('Article not found');
		}

		if (values.title) {
			article.title = values.title;
		}
		if (values.description) {
			article.description = values.description;
		}

		await article.save();

		res.json(article);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
};

exports.editData = editData;
exports.getData = getData;

// module.exports = getData;
