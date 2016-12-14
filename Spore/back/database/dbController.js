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
        UserID: user.userID,
		Password: user.pass,
        FirstName: user.fName,
        LastName: user.lName,
        Email: user.email,
		Gender: user.gender,
		FacebookID: user.facebookID,
		ProfilePicture: user.picture,
		EventsID: user.eventsID,
        School: user.school
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
	  
      newEventEntry.save(function(err, Event) {  
        if (err != null) {
		  return callback('Error saving event into datbase: ' + err);
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
  function addUserEvent(userId, eventID, callback){
	usersTable.update({UserID: userId}, {$push: {EventsID: eventID}}, function(err){
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
    eventLibrary.findOne({EventID: id}, function(err, Event){
      // -- if findOne is successful err will be null, else Event will be null
      return callback(err, Event);
    });
  }
  
  // -- fetch event information given a userID, start and end time
  function fetchUserEvents(eventIDArray, callback) {
   	var eventArray =[];
	var error = false;
	var getEvent = function (eventID){
      eventLibrary.findOne({EventID: eventID}, function(err, eventObj){
	    if (err == null){
		  console.log(eventObj);	
		  eventArray.push(eventObj);
		}
		else{
		  error = true;	
		}
	  });
	} 
	
	for(var i = 0; i < eventIDArray.length; i++){
	  getEvent(eventIDArray[i]);	
	}
	
	return callback(error, eventArray);
	
    /*eventLibrary.where('EventID').in(eventIDArray).exec(function(eventObj){
	  console.log("the event object is : " + eventObj);
      // eventArray.push(eventObj);

	});*/
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
  
  // -- delete event given a eventID
  function deleteEvent(id, callback) {
    eventLibrary.remove({EventID: id}, function(err){
      return callback(err);
    }); 
  }
  
   // -- delete event given a eventID
  function deleteUserEvent(Event, user, callback) {
    usersTable.update({UserID: user}, {$pull: {EventsID: Event}}, function(err){
	  return callback(err);
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

  return m;

  // -- END EXPORTS -----------------------------------------------------------------------------

}
