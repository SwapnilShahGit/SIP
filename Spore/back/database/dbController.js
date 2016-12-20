//_________________________________________________________________________________________________
// -- Controller for the objects and collections in the 'test' database.
// -- Created October 12, 2016
//_________________________________________________________________________________________________
var db = require('./model/db')();
var assert = require('assert');

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
        userID: user.userID,
		password: user.pass,
        firstName: user.fName,
        lastName: user.lName,
        email: user.email,
		gender: user.gender,
		facebookID: user.facebookID,
		profilePicture: user.picture,
		eventsID: user.eventsID,
        school: user.school
      });
      newUserEntry.save(function(err) {
      if (err) return callback('Error saving user into database: ' + err); 
      else return callback (null);
      });

    }
    else{
      return callback('User information is not valid or incomplete');
    }
  }


  // -- fetch user information given a userID
  function fetchUser(id, callback) {
    usersTable.findOne({userID: id}, function(err, user){
      // -- if findOne is successful err will be null, else user will be null
      return callback(err, user);
    });
  }
  
  // -- update user information given a userID
  function updateUser(id, field, value, callback) { 
	switch (field){
	  case "pass":
	    usersTable.update({ userID: id }, { $set: { password: value }}, function (err, raw) {
		  return callback(err, raw);
		});
		break;
	  case "fname":
		usersTable.update({ userID: id }, { $set: { firstName: value }}, function (err, raw) {
		  return callback(err, raw);
		});
		break;
	  case "lname":
		usersTable.update({ userID: id }, { $set: { lastName: value }}, function (err, raw) {
		  return callback(err, raw);
		});
		break;
	  case "email":
		usersTable.update({ userID: id }, { $set: { email: value }}, function (err, raw) {
		  return callback(err, raw);
		});
		break;
	  case "gender":
		usersTable.update({ userID: id }, { $set: { gender: value }}, function (err, raw) {
		  return callback(err, raw);
		});
		break;
	  case "facebookID":
		usersTable.update({ userID: id }, { $set: { facebookID: value }}, function (err, raw) {
		  return callback(err, raw);
		});
		break;
	  case "picture":
		usersTable.update({ userID: id }, { $set: { profilePicture: value }}, function (err, raw) {
		  return callback(err, raw);
		});		
		break;
	  case "school":		
		usersTable.update({ userID: id }, { $set: { school: value }}, function (err, raw) {
		  return callback(err, raw);
		});		
		break;
	  case "eventsID":		
		usersTable.update({ userID: id }, { $set: { eventsID: value }}, function (err, raw) {
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
		title: Event.title,
        startTime: Event.startTime,
        endTime: Event.endTime,
        backgroundColour: Event.bgColor,
        description: Event.description,
        location: Event.Location,
		contact: Event.contact,
		course: Event.course,
		repeat: Event.repeat		
      });
	  
      newEventEntry.save(function(err, Event) {  
        if (err != null) {
		  return callback('Error saving event into database: ' + err);
        }  
		else
		{
	      return callback(err,Event);
		}
      });

    }
    else{
      return callback('event information is not valid or incomplete');
    }
  }
  
  // -- add new event id to user event list given user id and event id
  function addUserEvent(uId, eventID, callback){
	usersTable.update({userID: uId}, {$push: {eventsID: eventID}}, function(err){
	  return callback(err);	
	});
  }
  
  
  // -- create and save a new event in 'EventLibrary'
  function javaSaveEvent(data, callback){
    var array = JSON.parse(data)
    eventLibrary.insertMany(array, function (err,r){
      assert.equal(null, err);
      assert.equal(array.length, r.length);
      var newids = [];
      for (var i = 0; i < r.length; i++) {
          newids.push(r[i].id);
      }
      callback(newids);
    })
  }


  // -- fetch event information given a eventID
  function fetchEvent(id, callback) {
    eventLibrary.findOne({_id: id}, function(err, Event){
      // -- if findOne is successful err will be null, else Event will be null
      return callback(err, Event);
    });
  }
  
  // -- fetch event information given a userID, start and end time
  function fetchUserEvents(eventIDArray, start, end, callback) {
	eventLibrary.find({_id: { $in: eventIDArray}, startTime: start, endTime: end}, function(err, Events){
	  return callback(err,Events);
	});
  }
  
 // -- update Event information given a event ID
  function updateEvent(id, field, value, callback) { 
	switch (field){
	  case "title":
	    eventLibrary.update({ _id: id }, { $set: { title:value }}, function (err, raw) {
		  return callback(err, raw);
		});
		break;
	  case "start":
		eventLibrary.update({ _id: id }, { $set: { startTime: value }}, function (err, raw) {
		  return callback(err, raw);
		});
		break;
	  case "end":
		eventLibrary.update({ _id: id }, { $set: { endTime: value }}, function (err, raw) {
		  return callback(err, raw);
		});
		break;
	  case "bg":
		eventLibrary.update({ _id: id }, { $set: { backgroundColour: value }}, function (err, raw) {
		  return callback(err, raw);
		});
		break;
	  case "desc":
		eventLibrary.update({ _id: id }, { $set: { description: value }}, function (err, raw) {
		  return callback(err, raw);
		});
		break;
	  case "loc":
		eventLibrary.update({ _id: id }, { $set: { location: value }}, function (err, raw) {
		  return callback(err, raw);
		});
		break;
	  case "con":
		eventLibrary.update({ _id: id }, { $set: { contact: value }}, function (err, raw) {
		  return callback(err, raw);
		});		
		break;
	  case "cou":
		eventLibrary.update({ _id: id }, { $set: { course: value }}, function (err, raw) {
		  return callback(err, raw);
		});		
		break;
	  case "rep":		
		eventLibrary.update({ _id: id }, { $set: { school: value }}, function (err, raw) {
		  return callback(err, raw);
		});		
		break;
	  default:
		return callback (110, "not a valid user parameter");
		break;
	}
  }
  
  // -- delete event given a eventID
  function deleteEvent(id, callback) {
    eventLibrary.remove({_id: id}, function(err){
      return callback(err);
    }); 
  }
  
   // -- delete event given a eventID
  function deleteUserEvent(Event, user, callback) {
    usersTable.update({userID: user}, {$pull: {eventsID: Event}}, function(err){
	  return callback(err);
    }); 
  }
    
  function checkCourseExists(id, callback){
    var query = 
    syllabusLibrary.find( one, function(err, docs) {
      
    });
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
  m.deleteEvent = deleteEvent;
  m.deleteUserEvent = deleteUserEvent;
  m.addUserEvent = addUserEvent;
  m.fetchUserEvents = fetchUserEvents;
  m.javaSaveEvent = javaSaveEvent;
  m.checkCourseExists = checkCourseExists;

  return m;

  // -- END EXPORTS -----------------------------------------------------------------------------

}
