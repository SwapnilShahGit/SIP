const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
	code: String,
	instructor: String,
	description: String,
	lectures: [],
	tutorials: [],
	practicals: [],
	office_hours: String,
	office_location: String,
	is_parse: Boolean,
	colour: String,
	exams: Boolean,
	exam_info: String,
	user: String
});

mongoose.model('course', courseSchema);
