//_________________________________________________________________________________________________
// -- Controller for the objects and collections in the 'test' database. 
// -- Created October 12, 2016
//_________________________________________________________________________________________________
var db = require('./model/db')();

module.exports = function(){
	
	// -- set up 
	var mongoose = db.mongoose;
	var usersTable = mongoose.model('usersTable');
	var syllabusLibrary = mongoose.model('syllabusLibrary');
	var eventLibrary = mongoose.model('eventLibrary');
	
	// -- create save user information in 'UserTable'
	function saveUser(user, callback) {	
		if (user){		
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
			newUserEntry.save(function(err) {
				if (err) return callback('Error saving user into database: ' + err); 
				return callback ('User succefully saved into database');
			});
			
		}
		else{
			return callback('User information is not valid or incomplete');
		}
	}
	
	
	// -- fetch user information given a userID
	function fetchUser(id, callback) {
		usersTable.findOne({UserID: id}, function(err, user){
			// -- if findOne is successful err will be null, else user will be null
			return callback(err, user);
		});
	}
	
	
	// -- create and save a new event in 'EventLibrary'
	function saveEvent(Event, callback){
		if (Event){
			var newEventEntry = new eventLibrary({
			   StartTime: Event.startTime,
			   EndTime: Event.endTime,
			   Title: Event.title,
			   Description: Event.description,
			   Type: Event.type,
			   DerivedFrom: Event.derivedFrom
			});
			newEventEntry.save(function(err) {
				if (err) return callback('Error saving event into datbase: ' + err);
			    return callback('event succefully saved into database');
			});
			
		}
		else{
			return callback('event information is not valid or incomplete');
		}
	}
	
	// -- fetch event information given a eventID
	function fetchEvent(id, callback) {
		eventLibrary.findOne({EventID: id}, function(err, Event){
			// -- if findOne is successful err will be null, else Event will be null
			return callback(err, Event);
		});	
	}
		
		
	// -- EXPORTS ---------------------------------------------------------------------------------
	
	var m = {};
	m.mongoose = mongoose;
	m.saveUser = saveUser;
	m.fetchUser = fetchUser;
	m.saveEvent = saveEvent;
	m.fetchEvent = fetchEvent;

	return m;
	
	// -- END EXPORTS -----------------------------------------------------------------------------

}
