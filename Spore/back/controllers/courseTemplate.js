const logger = require('winston');

const mongoose = require('mongoose');
const utility = require('../libs/utility');
const moment = require('moment');
const coroutine = global.Promise.coroutine;

const model = mongoose.model('courseTemplate');
const exam = mongoose.model('exam');

function addCourseTemplate(newCourseTemp) {
	logger.debug("adding course template");
	let courseTemplate = new model({
		hash:  newCourseTemp.hash,
        course_code: newCourseTemp.course,
        instructor: newCourseTemp.instructor,
        description: newCourseTemp.description,
        lectures: newCourseTemp.lectures,
        tutorials: newCourseTemp.tutorials,
        practicals: newCourseTemp.practical,
        office_hours: newCourseTemp.office_hours,
        office_location: newCourseTemp.office_location,
        exam_info: "Exam not yet available"
	});
	courseTemplate.save(courseTemplate)
		.then(function (doc) {
			logger.debug("course template saved");
		})
		.catch(function (err) {
			logger.debug("course template saving ERROR: " + err);
		})
		.finally(next);
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
				logger.debug("course template NOT FOUND");
			} else {
				logger.debug("course template found");
			}
		})
		.catch(function (err) {
			logger.debug("course template UNKNOWN ERROR: " + err);
		})
}

var m ={};
module.exports = function () {
	m.addCourseTemplate = addCourseTemplate;
	m.getCourseTemplate = getCourseTemplate;
};
return m;
