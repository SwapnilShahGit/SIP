const logger = require('winston');

const mongoose = require('mongoose');
const utility = require('../libs/utility');

const model = mongoose.model('courseTemplate');

function addCourseTemplate(req, res, next) {
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
			res.send({
				error: 0,
				data: doc
			});
		})
		.catch(function (err) {
			res.send({
				error: 110,
				data: err
			});
		})
		.finally(next);
}

function getCourseTemplate(req, res, next) {
	logger.debug("fetching CourseTemplate with course code:" + req.query.course);
	let query = {
		course_code: req.query.course,
	};
	utility.removeUndefined(query);
	model.findOne(query)
		.then(function (courseTemplate) {
			if (courseTemplate === null) {
				res.send({
					error: 110,
					data: "courseTemplate not found."
				});
			} else {
				console.log(courseTemplate);
				res.send({
					error: 0,
					data: courseTemplate
				});
			}
		})
		.catch(function (err) {
			res.send({
				error: 110,
				data: "Unknown error."
			});
		})
		.finally(next);
}

module.exports = function (server) {
	server.post('/api/courseTemplate', addCourseTemplate);
	server.get('/api/courseTemplate', getCourseTemplate);
};
