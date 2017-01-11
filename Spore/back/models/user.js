const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
	first: String,
	last: String,
	pass: String,
	email: String,
	gender: String,
	facebook_id: String,
	picture_uri: String,
	event_ids: [Schema.Types.ObjectId],
	school: String,
	theme: String
});

mongoose.model('user', userSchema);
