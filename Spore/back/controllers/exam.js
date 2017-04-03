const logger = require('winston');

const coroutine = global.Promise.coroutine;
const mongoose = require('mongoose');
const utility = require('../libs/utility');

const model = mongoose.model('exam');
const event = mongoose.model('event');
const user = mongoose.model('user');

function addExam(req, res, next) {
	logger.debug("adding Exam");
	let exam = new model({
		course_code: req.body.course,
		date: req.body.title.date,
		start: req.body.start,
		end: req.body.end,
		duration: req.body.duration,
		location: req.body.location,
		instructor: req.body.instructor
	});
	exam.save(exam)
		.then(coroutine(function*(doc) {
			yield event.update({course: req.body.course}, {$set: {exam: true}});
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

function getExam(req, res, next) {
	logger.debug("fetching exam");
	model.findOne({course_code: req.query.course})
		.then(function (exam) {
			if (exam === null) {
				res.send({
					error: 110,
					data: "exam not found."
				});
			} else {
				res.send({
					error: 0,
					data: exam
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

function updateExam(req, res, next) {
	let updated = {
		course_code: req.body.course,
    	date: req.body.title.date,
		start: req.body.start ? new Date(req.body.start) : undefined,
		end: req.body.end ? new Date(req.body.end) : undefined,
    	duration: req.body.duration,
    	location: req.body.location,
    	instructor: req.body.instructor
	};
	utility.removeUndefined(updated);
	model.findByIdAndUpdate(req.body.course, updated)
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
	server.del('/api/exam', addExam);
	server.get('/api/exam', getExam);
	server.post('/api/exam', updateExam);
};
