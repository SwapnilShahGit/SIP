//_________________________________________________________________________________________________
// -- script to populate database with dummy events
// -- events can range from being a few hours to week long
// -- between 2010-01-01T00:00 and 2020-12-31T24:00
// -- Created January 5, 2017
//_________________________________________________________________________________________________

var dj = require('dummy-json');
var Promise = require ('bluebird');
var mongoose = require('mongoose');
require('./models/user');
require('./models/event');
var counter = 0;


// -- get script arguments
var numOfEvents = process.argv[2];
var userID = process.argv[3];
var argStart = process.argv[4];
var argEnd = process.argv[5];

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


// -- function to create give number of events and save into db
function Populate(){
	for (var i = 1; i <= numOfEvents; i++){
		var user = mongoose.model('user');
		var event = mongoose.model('event');

	   var fewHours ='{{int 1 3600000 round=1000}}';
	   var sameDay = '{{int 1 86400000 round=1000}}';
	   var differentDay = '{{int 86400000 604800000 round=1000}}';

		var first = Date.parse(argStart);
		var last = Date.parse(argEnd);


		var startTime = Math.floor((Math.random() * (last - first +1) ) + first);
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
		 console.log ("Error Saving: " + err);
		})
	}
}
Populate();


