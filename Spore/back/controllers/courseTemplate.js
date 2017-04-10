const logger = require('winston');

const mongoose = require('mongoose');
const utility = require('../libs/utility');

const model = mongoose.model('courseTemplate');

function addCourseTemplate() {
	logger.debug("adding course template");
	let courseTemplate = new model({
		hash:  req.body.hash,
        course_code: req.body.course,
        instructor: req.body.instructor,
        description: req.body.description,
        lectures: req.body.lectures,
        tutorials: req.body.tutorials,
        practicals: req.body.practical

	});
	courseTemplate.save(courseTemplate)
		.then(function (doc) {
			console.log ("course template saved");
		})
		.catch(function (err) {
			console.log ("course template saving ERROR: " + err);
		});
}

function getCourseTemplate() {
	logger.debug("fetching CourseTemplate with course code:" + req.query.course);
	let query = {
		course_code: req.query.course,
	};
	utility.removeUndefined(query);
	return model.findOne(query)
		.then(function (courseTemplate) {
			if (courseTemplate === null) {
				console.log ("course template NOT FOUND");
			} else {
				("course template found");
			}
		})
		.catch(function (err) {
			("course template UNKNOWN ERROR: " + err);
		})
}

var m ={};
module.exports = function () {
	m.addCourseTemplate = addCourseTemplate;
	m.getCourseTemplate = getCourseTemplate;
};
return m;
