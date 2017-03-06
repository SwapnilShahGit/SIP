const exec = require('child_process').spawn;
const readline = require('readline');

// TODO: Consider moving to libs
// -- execute the parser to process JSON files
function java(req, res, next) {
	listOfCourseEvents = [];
	// TODO: check to see if course being requested already exists in the db
	//if dbController.checkCourseExists(req.query.id)
	// TODO: if it exists
	// TODO: find events related to that course and add them to listOfCourseEvents

	// if course DNE

	var child = exec('java', ['-jar', '../parser/Parser-jar-with-dependencies.jar']);
	const rl = readline.createInterface({
		input: child.stdout,
		output: child.stdin
	})

	rl.on('line', function (data) {
		var courseinfo = JSON.parse(data);
		dbController.javaSaveEvent(courseinfo.mongodbevents, function (stat) {
			// add events to listOfCourseEvents
			listOfCourseEvents.concat(stat);
		});
		// TODO: make a new course in the courses table with the newly generated id's
	});

	// TODO: check with the user to see which lecture/tutorial section they're in
	// TODO: add listOfCourseEvents to the user requesting this information
}

// TODO: If any business logic has to be done here, place it in user model.
function saveCoursetoUser(req, res, next) {
	// TODO: function should take in userID, course code, lecture section, tutorial section,
	// and practical section that they're in
}

function parse(req, res, next) {
	res.send(200);
}
module.exports = function (server) {
	server.post('/api/parse', parse);
}
