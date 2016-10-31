//_________________________________________________________________________________________________
// -- Controller for the objects and collections in the 'test' database. 
// -- Created October 12, 2016
//_________________________________________________________________________________________________

// -- group into a module
module.exports = function(){
	
	// -- set up 
	var db = require('./model/db');
	var mongoose = db.mongoose;
	
	var usersTable = mongoose.model('usersTable');
	var syllabusLibrary = mongoose.model('syllabusLibrary');
	var eventLibrary = mongoose.model('eventLibrary');
	
	// -- create save user information in 'UserTable'
	var saveUser = function(user) {	
		// -- make sure user is valid
		if (user){		
			// -- create the new user object
			var newUserEntry = new usersTable({
				UserID: user.user,
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
				if (err) return ('Error saving user into database: ' + err); 
			});
			return ('User succefully saved into database');
		}
		else{
			// -- return error message
			return ('User information is not valid or incomplete');
		}
	}
	
	
	// -- fetch user information given a userID
	function fetchUser(id) {
		// -- query the database for user 
		// -- each userID is unique so only one user should be returned
		var user = usersTable.findOne({UserID: id}, function(err, user){
			// -- return error message if cannot find user
			if (err) return ('Error fetching user info' + err);
		});
		// -- return user
		return user;
	}
	
	
	// -- create and save a new event in 'EventLibrary'
	function saveEvent(Event){
		// -- make sure the event is valid
		if (Event){		
			// -- create the new event object
			var newEventEntry = new eventLibrary({
			   StartTime: Event.startTime,
			   EndTime: Event.endTime,
			   Title: Event.title,
			   Description: Event.description,
			   Type: Event.type,
			   DerivedFrom: Event.derivedFrom, 
			   EventID: Event.eventID
			});
			// -- save the new event into database
			newEventEntry.save(function(err) {
				// -- return error message
				if (err) return ('Error saving event into datbase: ' + err); 
			});
			return ('event succefully saved into database');
		}
		else{
			// -- return error message
			return ('event information is not valid or incomplete');
		}
	}
	
	// -- fetch event information given a eventID
	function fetchEvent(id) {
		// -- query the database for eveny 
		// -- each eventID is unique so only one user should be returned
		var Event = eventLibrary.findOne({EventID: id}, function(err, Event){
			// -- return error message if cannot find event
			if (err) return ('Error fetching event info' + err);
		});
		// -- return event
		return Event;   
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

	