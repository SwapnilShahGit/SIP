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
	gender: String,
	facebook_id: {
		type: String,
		sparse: true,
		unique: true
	},
	picture_uri: String,
	school: String,
	theme: Object
});

mongoose.model('user', userSchema);
