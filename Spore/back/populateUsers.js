//_________________________________________________________________________________________________
// -- script to populate database with dummy users
// -- Created March 20, 2017
//_________________________________________________________________________________________________

var dj = require('dummy-json');
var Promise = require ('bluebird');
var mongoose = require('mongoose');
require('./models/user');
var counter = 0;

// -- get script arguments
var numOfUsers = process.argv[2];

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
function populate() {
	for (var i = 1; i <= numOfUsers; i++) {
		var user = mongoose.model('user');

		var firstName = dj.parse('{{firstName}}');
		var lastName = dj.parse('{{lastName}}');
		var password = dj.parse('{{lorem 1}}');

		var user = new user({
			 first: firstName,
			 last: lastName,
			 pass: password
		})
		
		user.save(user).then(function (doc) {
			counter++;
			if (counter == numOfUsers ) console.log("DONE");
		}).catch(function (err) {
			console.log("Error Saving: " + err);
		})
	}
}

populate();
