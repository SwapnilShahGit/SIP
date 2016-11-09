//_________________________________________________________________________________________________
// -- Handles events relating to the database connection and holds the schema and model definitions 
// -- that will be used for the 'test' database.  
// -- Created October 11, 2016
//_________________________________________________________________________________________________
// -- import statements
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

// -- group into a module
module.exports = function (){
		
	// -- create and start a connection to database named 'test' on localhost
	var dbURI = 'mongodb://localhost/test' ; 
	var connection = mongoose.connect(dbURI);
	
	// -- set up 
	var Schema = mongoose.Schema;
	autoIncrement.initialize(connection);

	// -- CONNECTION EVENTS -----------------------------------------------------------------------
	
	// -- when successfully connected
	mongoose.connection.on( 'connected', function(){
        console.log('Mongoose connected to ' + dbURI);
    } );
	
	// -- when connection throws an error 
    mongoose.connection.on( 'error', function( err ){
        console.log('Mongoose connection error: ' + err);
    } );
	
	// -- when connection is disconnected
    mongoose.connection.on( 'disconnected', function(){
        console.log('Mongoose connection disconnected');
    } );
	
	// -- END CONNECTION EVENTS -------------------------------------------------------------------
	
	
	// -- MODELS & SCHEMA -------------------------------------------------------------------------
	
	// -- create schema for table that will hold user information
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
	
	// -- create schema that will hold course information
	var syllabusLibrary = new Schema({
	   Hash: String,
	   CourseID: String,
	   ParsedInfo: String,
	   ReferenceNumber: Number,
	   EventIDList: [Number],
	   ExamEventID: Number
	});
	
	// -- create schema that will hold event information
	var eventLibrary = new Schema({
	   StartTime: Number,
	   EndTime: Number,
	   Title: String,
	   Description: String,
	   Type: String,
	   DerivedFrom: Number,
	   EventID: Number
	});
	
	// -- generate auto-incrementing event IDs 
	eventLibrary.plugin(autoIncrement.plugin, {
		model: 'Event',
		field: 'EventID',
		startAt: 0,
		incrementBy: 1
	});	

	// -- build the models for the schemas
	var usersTable = mongoose.model('usersTable', usersTable);
	var syllabusLibrary = mongoose.model('syllabusLibrary', syllabusLibrary);
	var eventLibrary = mongoose.model('eventLibrary', eventLibrary);
	
	// -- END MODELS & SCHEMA ---------------------------------------------------------------------
	
	// -- EXPORTS ---------------------------------------------------------------------------------
	
	var m = {};
	
	// -- db
	m.mongoose = mongoose;
	
	// -- return exports
	return m;
	
	
	// -- END EXPORTS -----------------------------------------------------------------------------
}