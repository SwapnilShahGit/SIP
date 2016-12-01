//_________________________________________________________________________________________________
// -- starting point of application that starts the server and ties everything together 
// -- Created October 12, 2016
//_________________________________________________________________________________________________
var restify = require('restify');
var exec = require('child_process').exec;
var fs = require('fs');
var dbController = require('./database/dbController')();

var HTTP_PORT = process.env.HTTP_PORT || 8080;
var HTTPS_PORT = process.env.HTTPS_PORT || 8081;

var server = restify.createServer();

// -- create and save user into db
function dbAddUser(req, res, next) {
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
    if (user == null || err) {
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
	repeat: req.query.rep	
  };
  dbController.saveEvent(eventInfo, function (stat){
    res.send(stat);
    next();
  });
}

// -- fetch event info from db given event id
function  dbFetchEvent(req, res, next){
  console.log("fetching event with id:" + req.query.e);
  dbController.fetchEvent(req.query.e, function(err, Event){
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
server.get('/api/parse', java);
server.head('/api/parse', java);
server.get('/api/createEvent', dbSaveEvent);
server.head('/api/createEvent', dbSaveEvent);
server.get('/api/showEvent', dbFetchEvent);
server.head('/api/showEvent', dbFetchEvent);
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
