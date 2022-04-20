const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const { getData, editData } = require('./controller');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

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
	const app = express();
	app.use(express.json());
	app.use(cors());
	app.options('*', cors());

	app.use(express.static('front-end'));

	app.post('/api/v1/news', getData);

	app.put('/api/v1/news/:id', editData);

	const port = process.env.PORT || 3000;
	app.listen(port, () => {
		console.log(` App running on port ${port}...`);
	});
})();
