global.Promise = require('bluebird');

const logger = require('winston');
logger.configure({
	transports: [
		new (logger.transports.Console)({
			colorize: true,
			timestamp: Date.now
		})
	]
});
logger.level = process.env.LOG_LEVEL || 'debug';

const fs = require('fs');
const mongoose = require('mongoose');
const restify = require('restify');

const DATABASE_URI = 'mongodb://localhost/spore';
const HTTP_PORT = process.env.HTTP_PORT || 8080;
const HTTPS_PORT = process.env.HTTPS_PORT || 8081;
const REDIRECT_PORT = process.env.REDIRECT_PORT || HTTPS_PORT;

function dropPrivileges() {
	if (typeof process.env.SPORE_GID !== 'undefined') {
		process.setgid(process.env.SPORE_GID);
		logger.info('gid was set to %s', process.getgid());
	}
	if (typeof process.env.SPORE_UID !== 'undefined') {
		process.setuid(process.env.SPORE_UID);
		logger.info('uid was set to %s', process.getuid());
	}
}

function getHostname(host) {
	let tokens = host.split(':');
	return tokens[0];
}

function redirectToHttps(req, res, next) {
	res.redirect('https://' + getHostname(req.headers.host) + ':' + REDIRECT_PORT + req.url, next);
}

if (!fs.existsSync('./uploads')) {
	fs.mkdirSync('./uploads');
}

mongoose.Promise = global.Promise;

mongoose.connect(DATABASE_URI);

mongoose.connection.on('connected', function () {
	logger.info('Mongoose connected to ' + DATABASE_URI);
});

mongoose.connection.on('error', function (err) {
	logger.error('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
	logger.info('Mongoose connection disconnected');
});

let server = restify.createServer({
	certificate: fs.readFileSync(process.env.CERT || 'cert.pem'),
	key: fs.readFileSync(process.env.KEY || 'key.pem'),
	name: 'Spore'
});

let httpServer = restify.createServer({
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

server.listen(HTTPS_PORT || 8081, function () {
	logger.info('%s listening at %s', server.name, server.url);
	httpServer.listen(HTTP_PORT || 8080, function () {
		logger.info('%s listening at %s', httpServer.name, httpServer.url);
		dropPrivileges();
	});
});
