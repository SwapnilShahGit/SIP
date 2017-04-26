const logger = require('winston');

const mongoose = require('mongoose');
const utility = require('../libs/utility');
const coroutine = global.Promise.coroutine;

const model = mongoose.model('course');
const user = mongoose.model('user');
const courseTemplate = mongoose.model('courseTemplate');

function addCourse(req, res, next) {
	logger.debug("adding course for user id: " + req.body.user);
	let course = new model({
		code: req.body.code,
		instructor: req.body.instructor,
		description: req.body.description,
		lectures: req.body.lectures,
		tutorials: req.body.tutorials,
		practicals: req.body.practicals,
		office_hours: req.body.office_hours,
		office_location: req.body.office_location,
		is_parse: req.body.is_parse,
		colour: req.body.colour,
		exams: req.body.exams,
		exam_info: req.body.exam_info,
		user: req.body.user
	});

	course.save(course)
		.then(coroutine(function*(doc) {
			yield user.update({_id: req.body.user}, {$push: {course_ids: doc.id}});
			res.send({
				error: 0,
				data: doc
			});
		}))
		.catch(function (err) {
			res.send({
				error: 110,
				data: err
			});
		})
		.finally(next);
}

function findExams(res, courses) {
	for (let x = 0; x < courses.length; x++) {
		courseTemplate.findOne({course_code: courses[x].code})
			.then(function (doc) {
				if (doc != null) {
					courses[x].exam_info = doc.exam_info;
				} else {
					logger.debug(courses[x].code + " CourseTemplate not found");
				}
				if (x == (courses.length - 1)) {
					res.send({
						error: 0,
						data: courses
					});
				}
			})
			.catch(function (err) {
				res.send({
					error: 110,
					data: ("error: " + err)
				});
			})
	}
}


function getUserCourses(req, res, next) {
	logger.debug("fetching Courses for user:" + req.query.user);
	user.findOne({_id: req.query.user})
		.then(function (doc) {
			model.find({_id: {$in: doc.course_ids}})
				.then(function (courses) {
					findExams(res, courses);
				})
		})
		.catch(function (err) {
			res.send({
				error: 110,
				data: ("error: " + err)
			});
		})
		.finally(next);
}

function deleteCourse(req, res, next) {
	user.update({_id: req.query.user}, {$pull: {course_ids: req.query.id}})
		.then(function (doc) {
			logger.debug("deleting course with id: " + req.query.id + "from user: " + req.query.user);
			res.send(200);
		})
		.catch(function (err) {
			res.send(404);
		})
		.finally(next);
}

function updateCourse(req, res, next) {
	logger.debug("updating courses with id: " + req.body.id);
	let updated = {
		code: req.body.code,
		instructor: req.body.instructor,
		description: req.body.description,
		lectures: req.body.lectures,
		tutorials: req.body.tutorials,
		practicals: req.body.practicals,
		office_hours: req.body.office_hours,
		office_location: req.body.office_location,
		is_parse: req.body.is_parse,
		colour: req.body.colour,
		exams: req.body.exams,
		exam_info: req.body.exam_info
	};
	utility.removeUndefined(updated);
	model.findByIdAndUpdate(req.body.id, updated, {new: true})
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

module.exports = function (server) {
	server.del('/api/courses', deleteCourse);
	server.get('/api/courses', getUserCourses);
	server.post('/api/courses', addCourse);
	server.put('/api/courses', updateCourse);
};
