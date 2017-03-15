const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	first: String,
	last: String,
	pass: String,
	email: {
		type: String,
		sparse: true,
		unique: true
	},
	facebook_id: {
		type: String,
		sparse: true,
		unique: true
	},
	picture_uri: String,
	event_ids: [Schema.Types.ObjectId],
	school: String,
	theme: Object
});

mongoose.model('user', userSchema);
