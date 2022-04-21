const mongoose = require('mongoose');
const dotenv = require('dotenv');
const got = require('got');
const convert = require('xml-js');

const Article = require('./articleModel');

dotenv.config({ path: '.env' });
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

const fetchData = async () => {
	const { body } = await got.get('https://www.lemonde.fr/rss/en_continu.xml');
	const result = convert.xml2json(body, { compact: true, spaces: 4 });

	const data = JSON.parse(result).rss.channel.item.reduce((acc, item) => {
		if (item['media:content']['media:description'] !== undefined) {
			acc.push({
				title: item.title._cdata,
				image: item['media:content']._attributes.url,
				description: item['media:content']['media:description']._text,
				published: item.pubDate._text,
				link: item.link._text,
			});
		}
		return acc;
	}, []);

	return data;
};

const createData = async (data) => {
	await Article.create(data);
};

async function connectDB() {
	await mongoose.connect(DB, {
		// useNewUrlParser: true,
		// useCreateIndex: true,
		// useFindAndModify: false,
	});
	console.log('DB connection succesful');
}

(async () => {
	await connectDB();
	const data = await fetchData();

	await createData(data);

	console.log('Data successfully loaded!');
})();
