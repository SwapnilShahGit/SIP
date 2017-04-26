const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseTemplateSchema = new Schema({
	hash: String,
	course_code: String,
	instructor: String,
	description: String,
	lectures: [],
	tutorials: [],
	practicals: [],
	office_hours: String,
	office_location: String,
	exam_info: String
});

mongoose.model('courseTemplate', courseTemplateSchema);
