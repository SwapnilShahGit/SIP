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
    	lectureSelected: req.body.lectureSelected,
    	lectures: lecArray,
    	tutorialSelected: req.body.tutorialSelected,
    	tutorials: req.body.tutorial,
    	practicalSelected: req.body.practicalSelected,
    	practicals: req.body.practical,
    	exams: req.body.exams,
    	user: req.body.user
	});
	course.save(course)
    		.then(coroutine(function*(doc) {
    			yield user.update({_id: req.body.user}, {$push: {courses_id: doc.id}});
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
				_id: {$in: doc.courses_id}
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
	user.update({_id: req.query.user}, {$pull: {courses_id: req.query.course}})
		.then(function (doc) {
			res.send(200);
		})
		.catch(function (err) {
			res.send(404);
		})
		.finally(next);
}

function updateCourse(req, res, next) {
	let updated = {
		hash: req.body.hash,
    	code: req.body.code,
    	instructor: req.body.instructor,
    	description: req.body.description,
    	lectureSelected: req.body.lectureSelected,
    	lectures: req.body.lectures,
    	tutorialSelected: req.body.tutorialSelected,
    	tutorials: req.body.tutorial,
    	practicalSelected: req.body.practicalSelected,
    	practicals: req.body.practical,
    	exams: req.body.exams
	};
	utility.removeUndefined(updated);
	model.findByIdAndUpdate(req.body.course, updated)
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
