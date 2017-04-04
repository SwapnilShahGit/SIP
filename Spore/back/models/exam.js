const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const examSchema = new Schema({
	course_code: String,
	date: Date,
	start: Date,
	end: Date ,
	duration: String,
	location: String,
	instructor: String,

});

mongoose.model('exam', examSchema);
