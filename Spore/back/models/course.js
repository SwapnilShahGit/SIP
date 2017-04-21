const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
	hash: String,
	code: String,
	instructor: String,
	description: String,
	lectures: [],
	tutorials: [],
	practicals: [],
    officeHours: [],
    isDraft: Boolean,
    colour: String,
    examNotifications: Boolean,
    examInfo: String,
	user: String
});

mongoose.model('course', courseSchema);
