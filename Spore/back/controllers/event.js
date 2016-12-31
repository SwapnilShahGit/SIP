const coroutine = global.Promise.coroutine;
const mongoose = require('mongoose');
const utility = require('../libs/utility');

const model = mongoose.model('event');
const user = mongoose.model('user');

function addEvent(req, res, next) {
	console.log("adding event");
	var event = new model({
		title: req.query.title,
		start: req.query.start ? new Date(req.query.start) : undefined,
		end: req.query.end ? new Date(req.query.end) : undefined,
		background: req.query.bg,
		description: req.query.desc,
		location: req.query.location,
		contact: req.query.contact,
		course: req.query.course,
		repeat: req.query.repeat
	});
	event.save(event).then(coroutine(function* (doc) {
		yield user.update({_id: req.query.user}, {$push: {event_ids: doc.id}});
		res.send({
			error: 0,
			data: doc
		});
	})).catch(function(err) {
		res.send({
			error: 110,
			data: err
		});
	}).finally(next);
}

function deleteEvent(req, res, next) {
	user.update({_id: req.query.user}, {$pull: {events_id: req.query.event}})
		.then(function(doc) {
			res.send({
				error: 0,
				data: "event deleted from user"
			});
		}).catch(function(err) {
			res.send({
				error: 110,
				data: err
			});
		}).finally(next);
}

function getEvent(req, res, next) {
	console.log("fetching event");
	user.findOne({_id: req.query.user}).then(function(doc) {
		return model.find({
			_id: {$in: doc.event_ids},
			start: {$gte: req.query.start ? new Date(req.query.start) : null},
			end: {$lte: req.query.end ? new Date(req.query.end) : null}
		});
	}).then(function(doc) {
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
	}).catch(function(err) {
		res.send({
			error: 110,
			data: "Unknown error."
		});
	}).finally(next);
}

function updateEvent(req, res, next) {
	var updated = {
		title: req.query.title,
		start: req.query.start ? new Date(req.query.start) : undefined,
		end: req.query.end ? new Date(req.query.end) : undefined,
		background: req.query.bg,
		description: req.query.desc,
		location: req.query.location,
		contact: req.query.contact,
		course: req.query.course,
		repeat: req.query.repeat
	};
	utility.removeUndefined(updated);
	model.findByIdAndUpdate(req.query.event, updated).then(function(doc) {
		res.send({
			error: 0,
			data: doc
		});
	}).catch(function(err) {
		res.send({
			error: 110,
			data: err
		});
	}).finally(next);
}

module.exports = function(server) {
	server.get('/api/addEvent', addEvent);
	server.head('/api/addEvent', addEvent);
	server.get('/api/deleteEvent', deleteEvent);
	server.head('/api/deleteEvent', deleteEvent);
	server.get('/api/getEvent', getEvent);
	server.head('/api/getEvent', getEvent);
	server.get('/api/updateEvent', updateEvent);
	server.head('/api/updateEvent', updateEvent);
}
