const mongoose = require('mongoose');
const utility = require('../libs/utility');

const model = mongoose.model('user');

function addUser(req, res, next) {
	console.log("adding user");
	var user = new model({
		first: req.query.first,
		last: req.query.last,
		pass: req.query.pass,
		email: req.query.email,
		gender: req.query.gender,
		facebook_id: req.query.fb,
		picture_uri: req.query.pic,
		event_ids: req.query.events,
		school: req.query.school
	});
	user.save(user).then(function(doc) {
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

function getUser(req, res, next) {
	console.log("fetching user with id:" + req.query.user);
	var query = {
		_id: req.query.user,
		facebook_id: req.query.fb
	};
	utility.removeUndefined(query);
	model.findOne(query).then(function(user) {
		if (user === null) {
			res.send({
				error: 110,
				data: "User not found."
			});
		} else {
			res.send({
				error: 0,
				data: user
			});
		}
	}).catch(function(err) {
		res.send({
			error: 110,
			data: "Unknown error."
		});
	}).finally(next);
}

function updateUser(req, res, next) {
	var updated = {
		first: req.query.first,
		last: req.query.last,
		pass: req.query.pass,
		email: req.query.email,
		gender: req.query.gender,
		facebook_id: req.query.fb,
		picture_uri: req.query.pic,
		event_ids: req.query.events,
		school: req.query.school
	};
	utility.removeUndefined(updated);
	model.findByIdAndUpdate(req.query.user, updated).then(function(doc) {
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
	server.get('/api/addUser', addUser);
	server.head('/api/addUser', addUser);
	server.get('/api/getUser', getUser);
	server.head('/api/getUser', getUser);
	server.get('/api/updateUser', updateUser);
	server.head('/api/updateUser', updateUser);
}
