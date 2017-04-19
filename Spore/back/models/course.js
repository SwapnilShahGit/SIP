const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
	hash: String,
	code: String,
	instructor: String,
	description: String,
	lectureSelected: Number,
	lectures: [],
	tutorialSelected: Number,
	tutorials: [],
	practicalSelected: Number,
	practicals: [],
	office_hours: String,
	office_location: String,
	exams: Boolean,
	user: String
});

mongoose.model('course', courseSchema);
