var restify = require('restify');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

var exec = require('child_process').exec;
var Cat = mongoose.model('Cat', { name: String });

function respond(req, res, next) {
  var kitty = new Cat({ name: req.params.name });
  kitty.save(function (err) {
    if (err) {
      res.send(err);
    } else {
      res.send('meow');
    }
    res.send('Saved');
  });
  next();
}

function fetchCat(req, res, next) {
  Cat.find({name: req.params.name}, function(err, cats){
	if (err) return res.send(err);
	res.send(cats);
  });
}

function java(req, res, next) {
  var child = exec('java -jar Parser-jar-with-dependencies.jar');
  child.stdout.on('data', function(data) {
	  console.log(foo);
	  res.send(foo);
  });
}
var restify = require('restify');
var mongoose = require('mongoose');
Schema = mongoose.Schema;

var connection = mongoose.connect('mongodb://localhost/test');

var usersTable = new Schema({
   UserID: Number,
   FirstName: String,
   LastName: String,
   Email: String,
   School: String,
   Password: String,
   EventID: [Number],
   Courses: [String]
});

var SyllabusLibrary = new Schema({
   Hash: String,
   CourseID: String,
   ParsedInfo: String,
   ReferenceNumber: Number,
   EventIDList: [Number],
   ExamEventID: Number
});

var EventLibrary = new Schema({
   EventID: Number,
   StartTime: Number,
   EndTime: Number,
   Title: String,
   Description: String,
   Type: String,
   DerivedFrom: Number
});

var exec = require('child_process').exec;
var usersTable = connection.model('userstable', usersTable);
var syllabusLibrary = connection.model('syllabuslibrary', SyllabusLibrary);
var eventLibrary = connection.model('eventlibrary', eventLibrary);

function saveUser(req, res, next) {
  var newUserEntry = new usersTable({
    UserID: 1,
    FirstName: req.params.name,
    LastName: req.params.name,
    Email: req.params.name,
    School: req.params.name,
    Password: req.params.name,
    EventID: [1,2],
    Courses: [req.params.name, 'Darren']
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
}

function fetchInformation(req, res, next) {
  usersTable.find({UserID: req.params.name}, function(err, cats){
       if (err) return res.send(err);
       res.send(cats);
  });


var server = restify.createServer();
server.get('/save/:FirstName/:LastName/:Email/:School/:Password', saveUser);
server.head('/save/:FirstName/:LastName/:Email/:School/:Password', saveUser);
server.get('/get/:username', fetchInformation);
server.head('/get/:username', fetchInformation);
server.get('/parse', java);
server.head('/parse', java);



server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
