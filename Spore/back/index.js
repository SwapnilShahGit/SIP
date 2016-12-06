//_________________________________________________________________________________________________
// -- starting point of application that starts the server and ties everything together 
// -- Created October 12, 2016
//_________________________________________________________________________________________________
var restify = require('restify');
var exec = require('child_process').exec;
var fs = require('fs');
var dbController = require('./database/dbController')();

// -- set up server
var server = restify.createServer();

// -- REQUEST HANDLERS ----------------------------------------------------------------------------

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
  error = 0; 
  data = null;
  if ( typeof req.query.user !== "undefined")
  {
    if (typeof req.query.pass !== "undefined")
	{
	  dbController.updateUser(req.query.user, "pass", req.query.pass, function(err, raw) {
		if (err != null) error = 110;
	  }); 
	}
	
	if (typeof req.query.first !== "undefined")
	{
	  dbController.updateUser(req.query.user, "fname", req.query.first, function(err, raw) {
		if (err != null) error = 110;
	  }); 
	}
	
	if (typeof req.query.last !== "undefined")
	{
	  dbController.updateUser(req.query.user, "lname", req.query.last, function(err, raw) {
		if (err != null) error = 110;	
	  }); 
	}
	
	if (typeof req.query.email !== "undefined")
	{
	  dbController.updateUser(req.query.user, "email", req.query.email, function(err, raw) {
		if (err != null) error = 110;	
	  }); 
	}
	
	if (typeof req.query.gen !== "undefined")
	{
	  dbController.updateUser(req.query.user, "gender", req.query.gen, function(err, raw) {
		if (err != null) error = 110;	
	  }); 
	}
	
	if (typeof req.query.fb !== "undefined")
	{
	  dbController.updateUser(req.query.user, "facebookID", req.query.fb, function(err, raw) {
		if (err != null) error = 110;	
	  }); 
	}
	
	if (typeof req.query.pic !== "undefined")
	{
	  dbController.updateUser(req.query.user, "picture", req.query.pic, function(err, raw) {
		if (err != null) error = 110;	
	  }); 
	}
		
	if (typeof req.query.school !== "undefined")
	{
	  dbController.updateUser(req.query.user, "school", req.query.school, function(err, raw) {
		if (err != null) error = 110;	
	  }); 
	}
	
	if (typeof req.query.events !== "undefined")
	{
	  dbController.updateUser(req.query.user, "eventsID", req.query.events, function(err, raw) {
		if (err != null) error = 110;	
	  }); 
	}
  }
  else
  {
    error = 110;
    data = "User Id not defined";
  }
  
  res.send({
	error: error,
    data: data
  });
}

// -- create and save event into db
function dbSaveEvent(req, res, next) {
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
  dbController.saveEvent(eventInfo, function (err){
   // res.send(stat);
   console.log("HERE 3");
	if (err == null)
	{
	  res.send({
        error: 0,
		data: null
      });
	}
	else
	{
	  res.send({
        error: 110,
		data: err
      });
		
	}
    next();
  });
}

// -- fetch event info from db given event id
function  dbFetchEvent(req, res, next){
  console.log("fetching event with id:" + req.query.Event);
  dbController.fetchEvent(req.query.Event, function(err, Event){
    if (Event !=null){
      res.send(Event);
    }
    else{
      res.send("Error fetching event, err: " + err);
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
      res.send(" event deleted from db");
    }
    else{
      res.send("Error deleting event, err: " + err);
    }
    next();
  });
}

// -- fetch event info from db given event id
function  dbDeleteUserEvent(req, res, next){
  console.log("deleting event with id:" + req.query.Event + " for user id: "+ req.query.user);
  dbController.deleteUserEvent(req.query.Event, req.query.user, function(err){
	  console.log("in callback err: " + err);
    if (err == null){
      res.send(" event deleted from user");
    }
    else{
      res.send("Error deleting event, err: " + err);
    }
    next();
  });
}

// -- fetch event IDs from db given user id 
function  dbFetchUserEventIDs(req, res, next){
  console.log("fetching event ids for user:" + req.query.user);
  
  dbController.fetchUser(req.query.user, function(err, User){
    if (User !=null){	
      res.send(User.EventsID);
    }
    else{
      res.send("Error fetching User, err: " + err);
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
server.get('/api/addUser', dbAddUser);
server.head('/api/addUser', dbAddUser);
server.get('/api/getUser', dbFetchUser);
server.head('/api/getUser', dbFetchUser);
server.get('/api/updateUser', dbUpdateUser);
server.head('/api/updateUser', dbUpdateUser);
server.get('/api/parse', java);
server.head('/api/parse', java);
server.get('/api/createEvent', dbSaveEvent);
server.head('/api/createEvent', dbSaveEvent);
server.get('/api/showEvent', dbFetchEvent);
server.head('/api/showEvent', dbFetchEvent);
server.get('/api/updateEvent', dbUpdateEvent);
server.head('/api/updateEvent', dbUpdateEvent);
server.get('/api/DeleteUserEvent', dbDeleteUserEvent);
server.head('/api/DeleteUserEvent', dbDeleteUserEvent);
server.get('/api/DeleteEvent', dbDeleteEvent);
server.head('/api/DeleteEvent', dbDeleteEvent);
server.get('/api/getUserEvents', dbFetchUserEventIDs);
server.head('/api/getUserEvents', dbFetchUserEventIDs);
server.get('/api/echo', echoValue);
server.head('/api/echo', echoValue);

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
