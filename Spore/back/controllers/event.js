const logger = require('winston');

const coroutine = global.Promise.coroutine;
const mongoose = require('mongoose');
const utility = require('../libs/utility');

const model = mongoose.model('event');

function addEvent(req, res, next) {
	logger.debug("adding event");
	let event = new model({
		title: req.body.title,
		start: req.body.start ? new Date(req.body.start) : undefined,
		end: req.body.end ? new Date(req.body.end) : undefined,
		owner: req.body.owner,
		users: req.body.users,
		background: req.body.bg,
		description: req.body.desc,
		location: req.body.location,
		contact: req.body.contact,
		course: req.body.course,
		repeat: req.body.repeat
	});
	event.save(event)
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

function deleteEvent(req, res, next) {
	model.remove({_id: req.query.event})
		.then(function (doc) {
			res.send(200);
		})
		.catch(function (err) {
			res.send(404);
		})
		.finally(next);
}

function getEvent(req, res, next) {
	logger.debug("fetching event");
	let query = {
		owner: {$in: req.query.user},
		users: {$in: req.query.user},
		start: {$gte: req.query.start ? new Date(req.query.start) : null},
		end: {$lte: req.query.end ? new Date(req.query.end) : null}
	};
	model.find(query)
		.then(function (doc) {
			if (doc === null) {
				res.send({
					error: 110,
					data: "Event not found."
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

function updateEvent(req, res, next) {
	let updated = {
		title: req.body.title,
		start: req.body.start ? new Date(req.body.start) : undefined,
		end: req.body.end ? new Date(req.body.end) : undefined,
		users: req.body.users,
		background: req.body.bg,
		description: req.body.desc,
		location: req.body.location,
		contact: req.body.contact,
		course: req.body.course,
		repeat: req.body.repeat
	};
	utility.removeUndefined(updated);
	model.findByIdAndUpdate(req.body.event, updated)
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
	server.del('/api/events', deleteEvent);
	server.get('/api/events', getEvent);
	server.post('/api/events', addEvent);
	server.put('/api/events', updateEvent);
};
