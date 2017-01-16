//_________________________________________________________________________________________________
// -- script to populate database with dummy events
// -- events can range from being a few hours to week long
// -- between 2010-01-01T00:00 and 2020-12-31T24:00
// -- Created January 5, 2017
//_________________________________________________________________________________________________
var dj = require('dummy-json');
var Promise = require ('bluebird');
var mongoose = require('mongoose');
var counter = 0;


// -- get script arguments
var numOfEvents = process.argv[2]
var userID = process.argv[3];

// -- set up db connection:
var DATABASE_URI = 'mongodb://localhost/spore';

mongoose.Promise = global.Promise;

mongoose.connect(DATABASE_URI);

mongoose.connection.on( 'connected', function() {
	console.log('Mongoose connected to ' + DATABASE_URI);
});

mongoose.connection.on( 'error', function( err ) {
	console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on( 'disconnected', function() {
	console.log('Mongoose connection disconnected');
});



// -- db schema/models
var Schema = mongoose.Schema;

var eventSchema = new Schema({
	title: String,
	start: Date,
	end: Date,
	background: String,
	description: String,
	location: String,
	contact: String,
	course: String,
	repeat: Number
});

var userSchema = new Schema({
	first: String,
	last: String,
	pass: String,
	email: String,
	gender: String,
	facebook_id: String,
	picture_uri: String,
	event_ids: [Schema.Types.ObjectId],
	school: String,
	theme: String
});


// -- function to create give number of events and save into db
function Populate(){
	for (var i = 1; i <= numOfEvents; i++){
		var user = mongoose.model('user', userSchema);
		var event = mongoose.model('event', eventSchema);

	   var date = '{{date "2015-01-01T00:00" "2020-12-31T24:00" "YYYY-MM-DDThh:mm:ss"}}';
	   var fewHours ='{{int 1 3600000 round=1000}}';
	   var sameDay = '{{int 1 86400000 round=1000}}';
	   var differentDay = '{{int 86400000 604800000 round=1000}}';

		var startTime = Date.parse(dj.parse(date));
		var endTime ;

		// -- longer events will be created less frequently than
		if ((i%100) == 0){
			//console.log("differentDay");
			endTime = startTime + parseInt(dj.parse(differentDay));
		}
		else if((i%75) == 0){
			//console.log("sameDay");
			endTime = startTime + parseInt(dj.parse(sameDay));
		}
		else{
			//console.log("fewHours");
			endTime = startTime + parseInt(dj.parse(fewHours));
		}

		var eventTitle = dj.parse('{{lorem 10}}');

		var event = new event({
			 title: eventTitle,
			 start: new Date(startTime),
			 end: new Date(endTime)
		})
		event.save(event).then(Promise.coroutine(function* (doc) {
			yield user.update({_id: userID}, {$push: {event_ids: doc.id}});
			counter++;
			if ((counter+1) == numOfEvents ) console.log("DONE");
		})).catch(function(err) {
		 console.log ("ERRROR Saving");
		})
	}
}
Populate();


