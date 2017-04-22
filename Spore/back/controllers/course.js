const logger = require('winston');

const mongoose = require('mongoose');
const utility = require('../libs/utility');
const coroutine = global.Promise.coroutine;

const model = mongoose.model('course');
const user = mongoose.model('user');

function addCourse(req, res, next) {
	logger.debug("adding course for user id: " + req.body.user);
	let course = new model({
		hash: req.body.hash,
		code: req.body.code,
		instructor: req.body.instructor,
		description: req.body.description,
		lectures: req.body.lectures,
		tutorials: req.body.tutorials,
		practicals: req.body.practicals,
		officeHours: req.body.officeHours,
		isDraft: req.body.isDraft,
		colour: req.body.colour,
		examNotifications: req.body.examNotifications,
		examInfo: req.body.examInfo,
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

function getUserCourses(req, res, next) {
	logger.debug("fetching Courses for user:" + req.query.user);
	user.findOne({_id: req.query.user})
		.then(function (doc) {
			return model.find({
				_id: {$in: doc.course_ids}
			});
		})
		.then(function (doc) {
			if (doc === null) {
				res.send({
					error: 110,
					data: "course not found."
				});
			} else {
				res.send({
					error: 0,
					data: doc
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

function deleteCourse(req, res, next) {
	user.update({_id: req.query.user}, {$pull: {course_ids: req.query.id}})
		.then(function (doc) {
			logger.debug("deleting course with id: " + req.body.id + "from user: " + req.body.user);
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
		hash: req.body.hash,
		code: req.body.code,
		instructor: req.body.instructor,
		description: req.body.description,
		lectures: req.body.lectures,
		tutorials: req.body.tutorials,
		practicals: req.body.practicals,
		officeHours: req.body.officeHours,
		isDraft: req.body.isDraft,
		colour: req.body.colour,
		examNotifications: req.body.examNotifications,
		examInfo: req.body.examInfo
	};
	utility.removeUndefined(updated);
	model.findByIdAndUpdate(req.body.id, updated)
		.then(function (doc) {
			res.send({
				error: 0,
				data: updated
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
