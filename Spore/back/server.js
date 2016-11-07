var restify = require('restify');
var mongoose = require('mongoose');
var fs = require('fs');
var exec = require('child_process').exec;
Schema = mongoose.Schema;
autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.connect('mongodb://localhost/test');
autoIncrement.initialize(connection);

//Create schema for table that will hold user information
var usersTable = new Schema({
   UserID: String,
   FirstName: String,
   LastName: String,
   Email: String,
   School: String,
   Password: String,
   EventID: [Number],
   Courses: [String]
});

//Create schema that will hold course information
var syllabusLibrary = new Schema({
   Hash: String,
   CourseID: String,
   ParsedInfo: String,
   ReferenceNumber: Number,
   EventIDList: [Number],
   ExamEventID: Number
});

//Create schema that will hold event information
var eventLibrary = new Schema({
   StartTime: Number,
   EndTime: Number,
   Title: String,
   Description: String,
   Type: String,
   DerivedFrom: Number
});

eventLibrary.plugin(autoIncrement.plugin, {
    model: 'Event',
    field: 'EventID',
    startAt: 0,
    incrementBy: 1
});

var usersTable = connection.model('userstable', usersTable);
var syllabusLibrary = connection.model('syllabuslibrary', syllabusLibrary);
var eventLibrary = connection.model('eventlibrary', eventLibrary);

//save user information in UserTable
function saveUser(req, res, next) {
  var newUserEntry = new usersTable({
    UserID: req.query.user,
    FirstName: req.query.fname,
    LastName: req.query.lname,
    Email: req.query.email,
    School: req.query.school,
    Password: req.query.pass,
    EventID: [1],
    Courses: ["hi"]
});
  newUserEntry.save(function (err) {
    if (err) {
      res.send(err);
    } else {
      res.send('User Not Successfully Saved');
    }
  });
  res.send('User Saved');
  next();
};

//save JSON information from OutputFile into MongoDB and then move to Archive folder
function parseJSONFile(req, res, next){

}

//fetch user information for their calendar
function fetchInformation(req, res, next) {
  usersTable.find({UserID: req.query.user}, function(err, cats){
       if (err) return res.send(err);
       res.send(cats);
  });
}

//execute the parser to process JSON files
function java(req, res, next) {
  var child = exec('java -jar ../parser/Parser-jar-with-dependencies.jar');
  child.stdout.on('data', function(data) {
	  console.log(data.toString('utf8'));
	  res.send(data.toString('utf8'));
  });
}

//create an event
function createEvent(req, res, next){
  var newEventEntry = new eventLibrary({
   StartTime: 1200,
   EndTime: 1400,
   Title: 'Swapnil',
   Description: 'Shah',
   Type: 'N',
   DerivedFrom: 2
   });
  newEventEntry.save(function (err) {
    if (err) {
      res.send(err);
    } else {
      res.send('Event Not Successfully Saved');
    }
  });
  res.send('Event Saved');
  next();
};

function showEvent(req, res, next){
  eventLibrary.find({EventID: req.query.eventid}, function(err, cats){
       if (err) return res.send(err);
       res.send(cats);
  });
}

function returnValue(req, res, next) {
  res.send(req.query.value);
  next();
}

function redirectToHttps(req, res, next) {
  res.redirect('https://' + req.headers.host + req.url, next);
}

//handle proper requests from user
var server = restify.createServer({
  certificate: fs.readFileSync(process.env.CERT || 'cert.pem'),
  key: fs.readFileSync(process.env.KEY || 'key.pem'),
  name: 'Spore'
});

server.use(restify.gzipResponse());
server.use(restify.queryParser({ mapParams: false }));

server.get('/save', saveUser);
server.head('/save', saveUser);
server.get('/get', fetchInformation);
server.head('/get', fetchInformation);
server.get('/parse', java);
server.head('/parse', java);
server.get('/createEvent', createEvent);
server.head('/createEvent', createEvent);
server.get('/showEvent', showEvent);
server.head('/showEvent', showEvent);
server.get('/echo', returnValue);
server.head('/echo', returnValue);

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
