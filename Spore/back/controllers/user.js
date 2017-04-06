const logger = require('winston');

const mongoose = require('mongoose');
const utility = require('../libs/utility');

const model = mongoose.model('user');

function addUser(req, res, next) {
	logger.debug("adding user");
	let user = new model({
		first: req.body.first,
		last: req.body.last,
		pass: req.body.pass,
		email: req.body.email,
		facebook_id: req.body.fb,
		picture_uri: req.body.pic,
		event_ids: req.body.events,
		school: req.body.school,
		theme: req.body.theme,
		tasks:  req.body.tasks
	});
	user.save(user)
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

function getUser(req, res, next) {
	logger.debug("fetching user with id:" + req.query.user);
	let query = {
		_id: req.query.user,
		facebook_id: req.query.fb
	};
	utility.removeUndefined(query);
	model.findOne(query)
		.then(function (user) {
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
		})
		.catch(function (err) {
			res.send({
				error: 110,
				data: "Unknown error."
			});
		})
		.finally(next);
}

function updateUser(req, res, next) {
	let updated = {
		first: req.body.first,
		last: req.body.last,
		pass: req.body.pass,
		email: req.body.email,
		facebook_id: req.body.fb,
		picture_uri: req.body.pic,
		event_ids: req.body.events,
		school: req.body.school,
		theme: req.body.theme,
		tasks:  req.body.tasks
	};
	utility.removeUndefined(updated);
	model.findByIdAndUpdate(req.body.user, updated)
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
	server.get('/api/users', getUser);
	server.post('/api/users', addUser);
	server.put('/api/users', updateUser);
};
