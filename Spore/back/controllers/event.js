const logger = require('winston');

const coroutine = global.Promise.coroutine;
const mongoose = require('mongoose');
const utility = require('../libs/utility');

const model = mongoose.model('event');
const user = mongoose.model('user');

function addEvent(req, res, next) {
	logger.debug("adding event");
	let event = new model({
		title: req.body.title,
		start: req.body.start ? new Date(req.body.start) : undefined,
		end: req.body.end ? new Date(req.body.end) : undefined,
		colour: req.body.colour,
		description: req.body.desc,
		location: req.body.location,
		contact: req.body.contact,
		course: req.body.course,
		repeat: req.body.repeat
	});
	event.save(event)
		.then(coroutine(function*(doc) {
			yield user.update({_id: req.body.user}, {$push: {event_ids: doc.id}});
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

function deleteEvent(req, res, next) {
	user.update({_id: req.query.user}, {$pull: {event_ids: req.query.event}})
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
	user.findOne({_id: req.query.user})
		.then(function (doc) {
			return model.find({
				_id: {$in: doc.event_ids},
				start: {$gte: req.query.start ? new Date(req.query.start) : null},
				$or: [
					{end: {$exists: false}},
					{end: {$lte: req.query.end ? new Date(req.query.end) : null}}
				]
			});
		})
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
		colour: req.body.colour,
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
