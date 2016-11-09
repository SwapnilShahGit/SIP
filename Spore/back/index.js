//_________________________________________________________________________________________________
// -- starting point of application that starts the server and ties everything together 
// -- Created October 12, 2016
//_________________________________________________________________________________________________
var restify = require('restify');
var exec = require('child_process').exec;
var testController = require ('./test/testController')();

// -- start the server
var server = restify.createServer();

// -- get the parameters of the request
server.use(restify.queryParser({ mapParams: false }));

// -- REQUEST HANDLERS ----------------------------------------------------------------------------

// -- create and save user into 'test'
function  testSaveUser(req, res, next){
	// -- create user
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
	// -- get the status of the save call
	testController.saveUser(userInfo, function(stat){
		// -- send response and done
		res.send(stat);
		next();
	});

}

// -- fetch user info from 'test' given user id
function  testFetchUser(req, res, next){
	console.log("fetching user with id:" + req.query.user);
	// -- find and fetch user info
	testController.fetchUser(req.query.user, function(err, user){
		// -- check if fetching user was succesfull
		if (user !=null){
			// -- send user object
			res.send(user);
		}
		else{
			// -- send error message
			res.send("Error fetching user, err: "+ err);
		}	
		// -- done
		next();
	});

}

// -- create and save event into 'test'
function  testSaveEvent(req, res, next){
	// -- create event
	var eventInfo = {
		startTime: req.query.startTime,
		endTime: req.query.endTime,
		title: req.query.title,
		description: req.query.description,
		type: req.query.type,
		derivedFrom: req.query.derivedFrom
	}; 
	// -- get the status of the save call
	testController.saveEvent(eventInfo, function (stat){
		// -- send response and done
		res.send(stat);
		next();
	});
}

// -- fetch event info from 'test' given event id
function  testFetchEvent(req, res, next){
	console.log("fetching event with id:" + req.query.eventID);
	// -- find and fetch event info
	testController.fetchEvent(req.query.eventID, function(err, Event){
		// -- check if fetching event was succesfull
		if (Event !=null){
			// -- send event object
			res.send(Event);
		}
		else{
			// -- send error message
			res.send("Error fetching event, err: " + err);
		}	
		// -- done
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

server.get(/\/?.*/, restify.serveStatic({
  directory: __dirname.concat('/../front/dist'),
  default: 'index.html'
}))

// -- specify the port the server is listening on
server.listen(process.env.PORT || 8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});