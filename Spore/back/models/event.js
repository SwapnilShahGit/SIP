const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
	title: String,
	start: Date,
	end: Date,
	colour: String,
	description: String,
	location: String,
	contact: String,
	course: String,
	dow: [],
	range: []
});

mongoose.model('event', eventSchema);
