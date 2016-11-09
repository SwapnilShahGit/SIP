//_________________________________________________________________________________________________
// -- Controller for the objects and collections in the 'test' database. 
// -- Created October 12, 2016
//_________________________________________________________________________________________________
// -- import statemnents
var db = require('./model/db')();

// -- group into a module
module.exports = function(){
	
	// -- set up 
	var mongoose = db.mongoose;
	
	var usersTable = mongoose.model('usersTable');
	var syllabusLibrary = mongoose.model('syllabusLibrary');
	var eventLibrary = mongoose.model('eventLibrary');
	
	// -- create save user information in 'UserTable'
	function saveUser(user, callback) {	
		// -- make sure user is valid
		if (user){		
			// -- create the new user object
			var newUserEntry = new usersTable({
				UserID: user.userID,
				FirstName: user.fName,
				LastName: user.lName,
				Email: user.email,
				School: user.school,
				Password: user.pass,
				EventID: user.eventID,
				Courses: user.courses
			});
			// -- save the new user into database
			newUserEntry.save(function(err) {
				// -- return error message 
				if (err) return callback('Error saving user into database: ' + err); 
				return callback ('User succefully saved into database');
			});
			
		}
		else{
			// -- return error message
			return callback('User information is not valid or incomplete');
		}
	}
	
	
	// -- fetch user information given a userID
	function fetchUser(id, callback) {
		// -- query the database for user 
		// -- each userID is unique so only one user should be returned
		usersTable.findOne({UserID: id}, function(err, user){
			// -- return user and err. if findOne is successful err will be null, else user will be null
			return callback(err, user);
		});
	}
	
	
	// -- create and save a new event in 'EventLibrary'
	function saveEvent(Event, callback){
		// -- make sure the event is valid
		if (Event){		
			// -- create the new event object
			var newEventEntry = new eventLibrary({
			   StartTime: Event.startTime,
			   EndTime: Event.endTime,
			   Title: Event.title,
			   Description: Event.description,
			   Type: Event.type,
			   DerivedFrom: Event.derivedFrom
			});
			// -- save the new event into database
			newEventEntry.save(function(err) {
				// -- return error message
				if (err) return callback('Error saving event into datbase: ' + err);
			    return callback('event succefully saved into database');
			});
			
		}
		else{
			// -- return error message
			return callback('event information is not valid or incomplete');
		}
	}
	
	// -- fetch event information given a eventID
	function fetchEvent(id, callback) {
		// -- query the database for eveny 
		// -- each eventID is unique so only one user should be returned
		eventLibrary.findOne({EventID: id}, function(err, Event){
			// -- return Event and err. if findOne is successful err will be null, else Event will be null
			return callback(err, Event);
		});	
	}
		
		
	// -- EXPORTS ---------------------------------------------------------------------------------
	
	var m = {};
	
	// -- db
	m.mongoose = mongoose;
	
	// -- functions
	m.saveUser = saveUser;
	m.fetchUser = fetchUser;
	m.saveEvent = saveEvent;
	m.fetchEvent = fetchEvent;
	
	// -- return exports
	return m;
	
	// -- END EXPORTS -----------------------------------------------------------------------------

}

	