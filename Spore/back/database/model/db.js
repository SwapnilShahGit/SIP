//_________________________________________________________________________________________________
// -- Handles events relating to the database connection and holds the schema and model definitions 
// -- that will be used for the 'test' database.  
// -- Created October 11, 2016
//_________________________________________________________________________________________________

var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

module.exports = function () {
  // -- create and start a connection to database named 'test' on localhost
  var dbURI = 'mongodb://localhost/test'; 
  mongoose.Promise = global.Promise
  mongoose.connect(dbURI);
  
  var Schema = mongoose.Schema;
  autoIncrement.initialize(mongoose.connection);

  // -- CONNECTION EVENTS -----------------------------------------------------------------------
  
  // -- when successfully connected
  mongoose.connection.on( 'connected', function() {
    console.log('Mongoose connected to ' + dbURI);
  });
  
  // -- when connection throws an error 
  mongoose.connection.on( 'error', function( err ) {
    console.log('Mongoose connection error: ' + err);
  });
  
  // -- when connection is disconnected
  mongoose.connection.on( 'disconnected', function() {
    console.log('Mongoose connection disconnected');
  });
  
  // -- END CONNECTION EVENTS -------------------------------------------------------------------
  
  // -- create schema for table that will hold user information
  var usersTable = new Schema({
    userID: {type: String, unique: true},
    password: String,
    firstName: String,
    lastName: String,
    email: String,
    gender: String,
    facebookID: String,
    profilePicture: String,
    eventsID: [String],
    school: String
  });
  
  // -- create schema that will hold course information
  var syllabusLibrary = new Schema({
    courseID: String,
    hash: String,
    referenceNumber: Number,
    eventIDList: [Schema.Types.Mixed],
    parsedInfo: String,
  });
  
  // -- create schema that will hold event information
  var eventLibrary = new Schema({
	title: String,
    startTime: String,
    endTime: String,
	backgroundColour: String,
    description: String,
    location: String,
	contact: String,
	course: String,
	repeat: String
  });
  

  var usersTable = mongoose.model('usersTable', usersTable);
  var syllabusLibrary = mongoose.model('syllabusLibrary', syllabusLibrary);
  var eventLibrary = mongoose.model('eventLibrary', eventLibrary);
    
  var exports = {};
  exports.mongoose = mongoose;
  return exports;
}
