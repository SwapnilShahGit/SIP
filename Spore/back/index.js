//_________________________________________________________________________________________________
// -- starting point of application that starts the server and ties everything together 
// -- Created October 12, 2016
//_________________________________________________________________________________________________
var restify = require('restify');
var exec = require('child_process').exec;
var fs = require('fs');
var testController = require ('./test/testController')();

// -- set up server
var server = restify.createServer();

// -- REQUEST HANDLERS ----------------------------------------------------------------------------

// -- create and save user into 'test'
function  testSaveUser(req, res, next){
	var userInfo = {
			userID: req.query.userID,
			fName: req.query.fName,
			lName: req.query.lName,
			email: req.query.email,
			school: req.query.school,
			pass: req.query.pass,
			eventID: req.query.eventID,
			courses: req.query.courses
	};
	testController.saveUser(userInfo, function(stat){
		res.send(stat);
		next();
	});

}

// -- fetch user info from 'test' given user id
function  testFetchUser(req, res, next){
	console.log("fetching user with id:" + req.query.user);
	testController.fetchUser(req.query.user, function(err, user){
		if (user !=null){
			res.send(user);
		}
		else{
			res.send("Error fetching user, err: "+ err);
		}	
		next();
	});

}

// -- create and save event into 'test'
function  testSaveEvent(req, res, next){
	var eventInfo = {
		startTime: req.query.startTime,
		endTime: req.query.endTime,
		title: req.query.title,
		description: req.query.description,
		type: req.query.type,
		derivedFrom: req.query.derivedFrom
	};
	testController.saveEvent(eventInfo, function (stat){
		res.send(stat);
		next();
	});
}

// -- fetch event info from 'test' given event id
function  testFetchEvent(req, res, next){
	console.log("fetching event with id:" + req.query.eventID);
	testController.fetchEvent(req.query.eventID, function(err, Event){
		if (Event !=null){
			res.send(Event);
		}
		else{
			res.send("Error fetching event, err: " + err);
		}
		next();
	});
}

// -- execute the parser to process JSON files
function java(req, res, next) {
	var child = exec('java -jar ../parser/Parser-jar-with-dependencies.jar');
	child.stdout.on('data', function(data) {
		console.log(data.toString('utf8'));
		res.send(data.toString('utf8'));
	});
	next();
}

// -- echo the input
function echoValue(req, res, next) {
	res.send(req.query.value);
	next();
}

// -- END REQUEST HANDLERS ------------------------------------------------------------------------

// -- helper function
function redirectToHttps(req, res, next) {
  res.redirect('https://' + req.headers.host + req.url, next);
}

// -- handle proper requests from user
var server = restify.createServer({
  certificate: fs.readFileSync(process.env.CERT || 'cert.pem'),
  key: fs.readFileSync(process.env.KEY || 'key.pem'),
  name: 'Spore'
});

server.use(restify.CORS({
  origins: ['http://localhost:3000']
}));
server.use(restify.gzipResponse());
server.use(restify.queryParser({ mapParams: false }));

// -- define routes for the requests
server.get('/save', testSaveUser);
server.head('/save', testSaveUser);
server.get('/get', testFetchUser);
server.head('/get', testFetchUser);
server.get('/parse', java);
server.head('/parse', java);
server.get('/createEvent', testSaveEvent);
server.head('/createEvent', testSaveEvent);
server.get('/showEvent', testFetchEvent);
server.head('/showEvent', testFetchEvent);
server.get('/echo', echoValue);
server.head('/echo', echoValue);

// -- redirect requests 
server.get(/\/?.*/, restify.serveStatic({
  directory: __dirname.concat('/../front/dist'),
  default: 'index.html',
  maxAge: 604800
}))

server.listen(process.env.HTTPS_PORT || 8081, function() {
  console.log('%s listening at %s', server.name, server.url);
});

httpServer = restify.createServer({
  name: 'HTTP Redirection Server'
});

httpServer.get(/\/?.*/, redirectToHttps);

httpServer.listen(process.env.HTTP_PORT || 8080, function() {
  console.log('%s listening at %s', httpServer.name, httpServer.url);
});