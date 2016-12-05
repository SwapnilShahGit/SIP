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
		Password: user.pass,
        FirstName: user.fName,
        LastName: user.lName,
        Email: user.email,
		Gender: user.gender,
		FacebookID: user.facebookID,
		ProfilePicture: user.picture,
		EventsID: user.eventID,
        School: user.school
      });
      newUserEntry.save(function(err) {
        if (err) return callback('Error saving user into database: ' + err); 
        return callback (null);
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
  
  // -- update user information given a userID
  function updateUser(id, field, value, callback) { 
	switch (field){
	  case "pass":
	    usersTable.update({ UserID: id }, { $set: { Password: value }}, function (err, raw) {
		  return callback(err, raw);
		});
		break;
	  case "fname":
		usersTable.update({ UserID: id }, { $set: { FirstName: value }}, function (err, raw) {
		  return callback(err, raw);
		});
		break;
	  case "lname":
		usersTable.update({ UserID: id }, { $set: { LastName: value }}, function (err, raw) {
		  return callback(err, raw);
		});
		break;
	  case "email":
		usersTable.update({ UserID: id }, { $set: { Email: value }}, function (err, raw) {
		  return callback(err, raw);
		});
		break;
	  case "gender":
		usersTable.update({ UserID: id }, { $set: { Gender: value }}, function (err, raw) {
		  return callback(err, raw);
		});
		break;
	  case "facebookID":
		usersTable.update({ UserID: id }, { $set: { FacebookID: value }}, function (err, raw) {
		  return callback(err, raw);
		});
		break;
	  case "picture":
		usersTable.update({ UserID: id }, { $set: { ProfilePicture: value }}, function (err, raw) {
		  return callback(err, raw);
		});		
		break;
	  case "school":		
		usersTable.update({ UserID: id }, { $set: { School: value }}, function (err, raw) {
		  return callback(err, raw);
		});		
		break;
	  case "eventsID":		
		usersTable.update({ UserID: id }, { $set: { EventsID: value }}, function (err, raw) {
		  return callback(err, raw);
		});		
		break;
	  default:
		return callback (110, "not a valid user parameter");
		break;
	}
  }
  
 
  // -- create and save a new event in 'EventLibrary'
  function saveEvent(Event, callback){
    if (Event){
      var newEventEntry = new eventLibrary({
		Title: Event.title,
        StartTime: Event.startTime,
        EndTime: Event.endTime,
        BackgroundColour: Event.bgColor,
        Description: Event.description,
        Location: Event.Location,
		Contact: Event.contact,
		Course: Event.course,
		Repeat: Event.repeat		
      });
      newEventEntry.save(function(err) {
        if (err) return callback('Error saving event into datbase: ' + err);
          return callback(null);
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
  
 // -- update Event information given a event ID
  function updateEvent(id, field, value, callback) { 
	switch (field){
	  case "title":
	    eventLibrary.update({ EventID: id }, { $set: { Title:value }}, function (err, raw) {
		  return callback(err, raw);
		});
		break;
	  case "start":
		eventLibrary.update({ EventID: id }, { $set: { StartTime: value }}, function (err, raw) {
		  return callback(err, raw);
		});
		break;
	  case "end":
		eventLibrary.update({ EventID: id }, { $set: { EndTime: value }}, function (err, raw) {
		  return callback(err, raw);
		});
		break;
	  case "bg":
		eventLibrary.update({ EventID: id }, { $set: { BackgroundColour: value }}, function (err, raw) {
		  return callback(err, raw);
		});
		break;
	  case "desc":
		eventLibrary.update({ EventID: id }, { $set: { Description: value }}, function (err, raw) {
		  return callback(err, raw);
		});
		break;
	  case "loc":
		eventLibrary.update({ EventID: id }, { $set: { Location: value }}, function (err, raw) {
		  return callback(err, raw);
		});
		break;
	  case "con":
		eventLibrary.update({ EventID: id }, { $set: { Contact: value }}, function (err, raw) {
		  return callback(err, raw);
		});		
		break;
	  case "cou":
		eventLibrary.update({ EventID: id }, { $set: { Course: value }}, function (err, raw) {
		  return callback(err, raw);
		});		
		break;
	  case "rep":		
		eventLibrary.update({ EventID: id }, { $set: { School: value }}, function (err, raw) {
		  return callback(err, raw);
		});		
		break;
	  default:
		return callback (110, "not a valid user parameter");
		break;
	}
  }
  
  
    
    
  // -- EXPORTS ---------------------------------------------------------------------------------
  
  var m = {};
  m.mongoose = mongoose;
  m.saveUser = saveUser;
  m.fetchUser = fetchUser;
  m.saveEvent = saveEvent;
  m.fetchEvent = fetchEvent;
  m.updateUser = updateUser; 
  m.updateEvent = updateEvent;

  return m;
  
  // -- END EXPORTS -----------------------------------------------------------------------------

}
