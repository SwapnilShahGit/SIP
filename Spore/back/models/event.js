const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var eventSchema = new Schema({
	title: String,
	start: Date,
	end: Date,
	background: String,
	description: String,
	location: String,
	contact: String,
	course: String,
	repeat: Number
});

mongoose.model('event', eventSchema);
