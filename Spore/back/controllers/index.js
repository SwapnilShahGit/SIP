const fs = require('fs');
const restify = require('restify');

function echoValue(req, res, next) {
	res.send(req.query.value);
	next();
}

function redirectToFront(req, res, err, next) {
	res.redirect('https://' + req.headers.host + '/#' + req.url, next);
}

module.exports = function(server) {
	fs.readdirSync('./controllers').forEach(function(file) {
		if (file.substr(-3) == '.js' && file != 'index.js') {
			require('./' + file)(server);
		}
	});

	server.get('/api/echo', echoValue);
	server.head('/api/echo', echoValue);

	server.get(/\/?.*/, restify.serveStatic({
		directory: __dirname.concat('/../../front/dist'),
		default: 'index.html',
		maxAge: 604800
	}));

	server.on('ResourceNotFound', redirectToFront);
};



