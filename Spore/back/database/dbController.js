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
