//_________________________________________________________________________________________________
// -- starting point of application that starts the server and ties everything together
// -- Created October 12, 2016
//_________________________________________________________________________________________________
var restify = require('restify');
var exec = require('child_process').spawn;
var fs = require('fs');
var dbController = require('./database/dbController')();
const readline = require('readline');

var HTTP_PORT = process.env.HTTP_PORT || 8080;
var HTTPS_PORT = process.env.HTTPS_PORT || 8081;

var server = restify.createServer();

// -- create and save user into db
function dbAddUser(req, res, next) {
  console.log("adding user with id:" + req.query.user);
  var userInfo = {
    userID: req.query.user,
    pass: req.query.pass,
    fName: req.query.first,
    lName: req.query.last,
    email: req.query.email,
	gender: req.query.gen,
	facebookID: req.query.fb,
	picture: req.query.pic,
	eventsID: req.query.events,
    school: req.query.school
  };
  dbController.saveUser(userInfo, function(err) {
    if (err) {
      res.send({
        error: 110,
        data: "error"
      });
    } else {
      res.send({
        error: 0,
        data: "Successfully saved user."
      });
    }
    next();
  });
}

// -- fetch user info from db given user id
function dbFetchUser(req, res, next) {
  console.log("fetching user with id:" + req.query.user);
  dbController.fetchUser(req.query.user, function(err, user) {
    if (user == null || err != null) {
      res.send({
        error: 110,
        data: "error"
      });
    } else {
      res.send({
        error: 0,
        data: user
      });
    }
    next();
  });

}

// -- update user info in db given user id
function dbUpdateUser(req, res, next) {
  console.log("updating user with id:" + req.query.user);
  if ( typeof req.query.user !== "undefined"){
    dbController.fetchUser(req.query.user, function(err, User) {
	  var tempUser = User; 	
		
	  if (typeof req.query.pass !== "undefined")
	  {
	    tempUser.password = req.query.pass;
	  }
	  
      if (typeof req.query.first !== "undefined")
	  {
	    tempUser.firstName = req.query.first;
	  }
		
	  if (typeof req.query.last !== "undefined")
	  {
	    tempUser.lastName = req.query.last; 
	  }
		
	  if (typeof req.query.email !== "undefined")
	  {
	    tempUser.email = req.query.email; 
  	  }
		
	  if (typeof req.query.gen !== "undefined")
	  {
	    tempUser.gender = req.query.gen; 
	  }
		
	  if (typeof req.query.fb !== "undefined")
	  {
	    tempUser.facebookID = req.query.fb; 
	  }
		
	  if (typeof req.query.pic !== "undefined")
	  {
	    tempUser.profilePicture = req.query.pic; 
	  }
			
	  if (typeof req.query.school !== "undefined")
	  {
	    tempUser.school = req.query.school; 
	  }
		
	  if (typeof req.query.events !== "undefined")
	  {
	    tempUser.eventsID = req.query.events; 
	  }
	  
	  dbController.updateUser(tempUser,function(err, raw) {
	    if (err != null){
	  	  res.send({
			error: 110,
			data: err
		  });
		}
		else{
		  res.send({
			error: 0,
			data: tempUser
		  });  
		}
	  }); 
      
    });
	next();
  }
  else{
	res.send({
	  error: 110,
      data: "User Id not defined"
    });
	next();
  }
}

// -- create and save event into db and add event ID to user
function dbAddEvent(req, res, next) {
  var eventInfo = {
	title: req.query.title,
    startTime: req.query.start,
    endTime: req.query.end,
    bgColor: req.query.bg,
    description: req.query.desc,
    Location: req.query.loc,
    contact: req.query.con,
	course: req.query.cou,
	repeat: req.query.rep	
  };
  dbController.saveEvent(eventInfo, function (err, Event){
	if (err == null)
	{	
	  dbController.addUserEvent(req.query.user, Event._id, function(Err){
		if (Err == null)
		{
		  res.send({
            error: 0,
		    data: "successfully added event for user"
          });
		  next();
		}
		else
		{
		  res.send({
            error: 110,
		    data: "error adding event to User"
          });
		  next();
		}
	  });
	}
	else
	{
	  res.send({
        error: 110,
		data: "error saving event in DB: " + err
      });
	  next();
	}
  });
}

// -- fetch event info from db given event id
function  dbFetchEvent(req, res, next){
  console.log("fetching event with id:" + req.query.Event);
  dbController.fetchEvent(req.query.Event, function(err, Event){
    if (Event !=null){
      res.send({
		error: 0,
		data: Event
	});
    }
    else{
      res.send({
		error:110,
		data: "Error fetching event"
	  });
    }
    next();
  });
}

// -- update event info in db given event id
function dbUpdateEvent(req, res, next) {
  console.log("updating event with id:" + req.query.Event);
  error = 0; 
  data = null;
  if ( typeof req.query.Event !== "undefined")
  {
    if (typeof req.query.title !== "undefined")
	{
	  dbController.updateEvent(req.query.Event, "title", req.query.title, function(err, raw) {
		if (err != null) error = 110;
	  }); 
	}
	
	if (typeof req.query.start !== "undefined")
	{
	  dbController.updateEvent(req.query.Event, "start", req.query.start, function(err, raw) {
		if (err != null) error = 110;
	  }); 
	}
	
	if (typeof req.query.end !== "undefined")
	{
	  dbController.updateEvent(req.query.Event, "end", req.query.end, function(err, raw) {
		if (err != null) error = 110;	
	  }); 
	}
	
	if (typeof req.query.bg !== "undefined")
	{
	  dbController.updateEvent(req.query.Event, "bg", req.query.bg, function(err, raw) {
		if (err != null) error = 110;	
	  }); 
	}
	
	if (typeof req.query.desc !== "undefined")
	{
	  dbController.updateEvent(req.query.Event, "desc", req.query.desc, function(err, raw) {
		if (err != null) error = 110;	
	  }); 
	}
	
	if (typeof req.query.loc !== "undefined")
	{
	  dbController.updateEvent(req.query.Event, "loc", req.query.loc, function(err, raw) {
		if (err != null) error = 110;	
	  }); 
	}
	
	if (typeof req.query.con !== "undefined")
	{
	  dbController.updateEvent(req.query.Event, "con", req.query.con, function(err, raw) {
		if (err != null) error = 110;	
	  }); 
	}
		
	if (typeof req.query.cou !== "undefined")
	{
	  dbController.updateEvent(req.query.Event, "cou", req.query.cou, function(err, raw) {
		if (err != null) error = 110;	
	  }); 
	}	
	
	if (typeof req.query.rep !== "undefined")
	{
	  dbController.updateEvent(req.query.Event, "rep", req.query.rep, function(err, raw) {
		if (err != null) error = 110;	
	  }); 
	}
  }
  else
  {
    error = 110;
    data = "Event Id not defined";
  }
  
  res.send({
	error: error,
    data: data
  });
}

// -- fetch event info from db given event id
function  dbDeleteEvent(req, res, next){
  console.log("deleting event with id:" + req.query.Event);
  dbController.deleteEvent(req.query.Event, function(err){
    if (err == null){
      res.send({
		error: 0,
		data: " event deleted from db"
	  });
    }
    else{
      res.send({
		error: 110,
		data: "error deleting event"
	  });
    }
    next();
  });
}

// -- fetch event info from db given event id
function  dbDeleteUserEvent(req, res, next){
  console.log("deleting event with id:" + req.query.Event + " for user id: "+ req.query.user);
  dbController.deleteUserEvent(req.query.Event, req.query.user, function(err){
    if (err == null){
      res.send({
		error: 0,
		data: " event deleted from user"
	  });
    }
    else{
      res.send({
		error: 110,
		data: "error deleting events from user"
	  });
    }
    next();
    });
}



// -- fetch event IDs from db given user id 
function  dbFetchUserEvents(req, res, next){
  console.log("fetching event ids for user:" + req.query.user);
  var arrayToSend= [];
  dbController.fetchUser(req.query.user, function(err, User){
    if (User !=null){
	  // -- convert event info for front-end to use	
	  dbController.fetchUserEvents(User.eventsID, req.query.start, req.query.end, function(Err, events){	
		for (var i = 0; i < events.length; i++){
		  var currentEvent = {
			title: events[i].title,
			start: events[i].startTime,
			end: events[i].endTime,
			id: events[i]._id,
			color: events[i].backgroundColour,
			description: events[i].description,
			location: events[i].location,
			contact: events[i].contact,
			course: events[i].course,
			repeat: events[i].repeat
		  }
		  arrayToSend.push(currentEvent);
		}
	    if (Err == null){
	      res.send({
	  	    error: 0,
		    data: arrayToSend
	      });
	    }
	    else{
	      res.send({
	  	    error: 110,
		    data: "could not get all user events"
	      });		
	    }
	  });
	  next();
    }
    else{
      res.send({
		error: 110,
		data: "Error fetching User"
		
	  });
	  next();
    }
    
  });
}

// -- execute the parser to process JSON files
function java(req, res, next) {
  listOfCourseEvents = [];
  // TODO: check to see if course being requested already exists in the db
  //if dbController.checkCourseExists(req.query.id)
  // TODO: if it exists
    // TODO: find events related to that course and add them to listOfCourseEvents
  
  // if course DNE
    
    var child = exec('java', ['-jar', '../parser/Parser-jar-with-dependencies.jar']);
    const rl = readline.createInterface({
      input: child.stdout,
      output: child.stdin
    })
    
    rl.on('line', function(data) {
      var courseinfo = JSON.parse(data);
      dbController.javaSaveEvent(courseinfo.mongodbevents, function(stat){
      // add events to listOfCourseEvents
      listOfCourseEvents.concat(stat);
      });
    
    // TODO: make a new course in the courses table with the newly generated id's

    });
  // TODO: check with the user to see which lecture/tutorial section they're in
  // TODO: add listOfCourseEvents to the user requesting this information
}

function saveCoursetoUser(req, res, next){
// TODO: function should take in userID, course code, lecture section, tutorial section,
// and practical section that they're in
}

// -- echo the input
function echoValue(req, res, next) {
  res.send(req.query.value);
  next();
}

function redirectToHttps(req, res, next) {
  res.redirect('https://' + getHostname(req.headers.host) + ':' + HTTPS_PORT + req.url, next);
}

function redirectToFront(req, res, err, next) {
  res.redirect('https://' + req.headers.host + '/#' + req.url, next);
}

function getHostname(host) {
  var tokens = host.split(':');
  return tokens[0];
}

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
server.get('/api/addUser', dbAddUser);
server.head('/api/addUser', dbAddUser);
server.get('/api/getUser', dbFetchUser);
server.head('/api/getUser', dbFetchUser);
server.get('/api/updateUser', dbUpdateUser);
server.head('/api/updateUser', dbUpdateUser);
server.get('/api/parse', java);
server.head('/api/parse', java);
server.get('/api/addEvent', dbAddEvent);
server.head('/api/addEvent', dbAddEvent);
server.get('/api/showEvent', dbFetchEvent);
server.head('/api/showEvent', dbFetchEvent);
server.get('/api/updateEvent', dbUpdateEvent);
server.head('/api/updateEvent', dbUpdateEvent);
server.get('/api/deleteUserEvent', dbDeleteUserEvent);
server.head('/api/deleteUserEvent', dbDeleteUserEvent);
server.get('/api/deleteEvent', dbDeleteEvent);
server.head('/api/deleteEvent', dbDeleteEvent);
server.get('/api/getUserEvents', dbFetchUserEvents);
server.head('/api/getUserEvents', dbFetchUserEvents);
server.get('/api/echo', echoValue);
server.head('/api/echo', echoValue);

server.get(/\/?.*/, restify.serveStatic({
  directory: __dirname.concat('/../front/dist'),
  default: 'index.html',
  maxAge: 604800
}));

server.on('ResourceNotFound', redirectToFront);

httpServer = restify.createServer({
  name: 'HTTP Redirection Server'
});

httpServer.get(/\/?.*/, redirectToHttps);

server.listen(HTTPS_PORT || 8081, function() {
  console.log('%s listening at %s', server.name, server.url);
  httpServer.listen(HTTP_PORT || 8080, function() {
    console.log('%s listening at %s', httpServer.name, httpServer.url);
    dropPrivileges();
  });
});
