const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
	title: String,
	start: Date,
	end: Date,
	owner: Schema.Types.ObjectId,
	users: [Schema.Types.ObjectId],
	background: String,
	contact: String,
	course: String,
	description: String,
	location: String,
	repeat: Number
});

mongoose.model('event', eventSchema);
