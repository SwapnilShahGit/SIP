const logger = require('winston');

const mongoose = require('mongoose');
const utility = require('../libs/utility');
const coroutine = global.Promise.coroutine;

const model = mongoose.model('course');
const user = mongoose.model('user');
const event = mongoose.model('event');
const courseTemplate = mongoose.model('courseTemplate');

Array.prototype.diff = function(array) {
	return this.filter(function(i) {return a.indexOf(i) < 0;});
};

function getDayOfWeek(day) {
	let days = {
		SUNDAY: 1,
		MONDAY: 2,
		TUESDAY: 3,
		WEDNESDAY: 4,
		THURSDAY: 5,
		FRIDAY: 6,
		SATURDAY: 7
	};
	return days[day];
}

function createEventForSection(section, time, colour) {
	let query = {
		title: section.code,
		start: time.start ? new Date(time.start) : undefined,
		end: time.end ? new Date(time.end) : undefined,
		dow: getDayOfWeek(time.day.toUpperCase())
	};
	utility.removeUndefined(query);
	let event_mod = new event(query);
	return time._id ? event.findByIdAndUpdate(time._id, event_mod, {new: true}) : event_mod.save(event_mod);
}

let addEventForSections = coroutine(function* (req) {
	let new_events = [];
	for (let i = 0; i < req.body.lectures.length; i++) {
		for (let j = 0; j < req.body.lectures[i].times.length; j++) {
			event_obj = yield createEventForSection(req.body.lectures[i], req.body.lectures[i].times[j], req.body.colour);
			req.body.lectures[i].times[j]._id = event_obj._id;
			new_events.push(event_obj._id);
			yield user.update({_id: req.body.user}, {$addToSet: {event_ids: event_obj._id}});
		}
	}
	for (let i = 0; i < req.body.tutorials.length; i++) {
		for (let j = 0; j < req.body.tutorials[i].times.length; j++) {
			event_obj = yield createEventForSection(req.body.tutorials[i], req.body.tutorials[i].times[j], req.body.colour);
			req.body.tutorials[i].times[j]._id = event_obj._id;
			new_events.push(event_obj._id);
			yield user.update({_id: req.body.user}, {$addToSet: {event_ids: event_obj._id}});
		}
	}
	for (let i = 0; i < req.body.practicals.length; i++) {
		for (let j = 0; j < req.body.practicals[i].times.length; j++) {
			event_obj = yield createEventForSection(req.body.practicals[i], req.body.practicals[i].times[j], req.body.colour);
			req.body.practicals[i].times[j]._id = event_obj._id;
			new_events.push(event_obj._id);
			yield user.update({_id: req.body.user}, {$addToSet: {event_ids: event_obj._id}});
		}
	}
	let oldEvents = (req.body.event_ids || []).diff(new_events);
	for (let i = 0; i < oldEvents.length; i++) {
		yield user.update({_id: req.body.user}, {$pull: {event_ids: oldEvents[i]}});
	}
	return new_events;
});

function addCourse(req, res, next) {
	logger.debug("adding course for user id: " + req.body.user);
	addEventForSections(req)
		.then(function (events) {
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
				user: req.body.user,
				event_ids: events
			});
			return course.save(course)
		})
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
	addEventForSections(req)
		.then(function (events) {
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
				exam_info: req.body.exam_info,
				event_ids: events
			};
			utility.removeUndefined(updated);
			return model.findByIdAndUpdate(req.body.id, updated, {new: true})
		})
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
