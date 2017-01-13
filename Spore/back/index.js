global.Promise = require('bluebird');

const fs = require('fs');
const mongoose = require('mongoose');
const restify = require('restify');

const DATABASE_URI = 'mongodb://localhost/spore';
const HTTP_PORT = process.env.HTTP_PORT || 8080;
const HTTPS_PORT = process.env.HTTPS_PORT || 8081;

function dropPrivileges() {
	if (typeof process.env.SPORE_GID !== 'undefined') {
		process.setgid(process.env.SPORE_GID);
		console.log('gid was set to %s', process.getgid());
	}
	if (typeof process.env.SPORE_UID !== 'undefined') {
		process.setuid(process.env.SPORE_UID);
		console.log('uid was set to %s', process.getuid());
	}
}

function getHostname(host) {
	var tokens = host.split(':');
	return tokens[0];
}

function redirectToHttps(req, res, next) {
	res.redirect('https://' + getHostname(req.headers.host) + ':' + HTTPS_PORT + req.url, next);
}

if (!fs.existsSync('./uploads')){
    fs.mkdirSync('./uploads');
}

mongoose.Promise = global.Promise;

mongoose.connect(DATABASE_URI);

mongoose.connection.on( 'connected', function() {
	console.log('Mongoose connected to ' + DATABASE_URI);
});

mongoose.connection.on( 'error', function( err ) {
	console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on( 'disconnected', function() {
	console.log('Mongoose connection disconnected');
});

var server = restify.createServer({
	certificate: fs.readFileSync(process.env.CERT || 'cert.pem'),
	key: fs.readFileSync(process.env.KEY || 'key.pem'),
	name: 'Spore'
});

var httpServer = restify.createServer({
	name: 'HTTP Redirection Server'
});

httpServer.get(/\/?.*/, redirectToHttps);

server.use(restify.bodyParser({
	mapParams: false,
	maxBodySize: 15 * 1024 * 1024,
	keepExtensions: false,
	uploadDir: process.env.UPLOAD_DIR || './uploads',
	multiples: true,
	hash: 'sha1'
}));
server.use(restify.CORS({
	origins: ['http://localhost:3000'],
	credentials: true
}));
server.use(restify.gzipResponse());
server.use(restify.queryParser({
	mapParams: false
}));

require('./models/index');
require('./controllers/index')(server);

server.listen(HTTPS_PORT || 8081, function() {
	console.log('%s listening at %s', server.name, server.url);
	httpServer.listen(HTTP_PORT || 8080, function() {
		console.log('%s listening at %s', httpServer.name, httpServer.url);
		dropPrivileges();
	});
});
