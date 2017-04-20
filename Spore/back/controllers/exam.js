const logger = require('winston');
const fs = require('fs');
const moment = require('moment');

const coroutine = global.Promise.coroutine;
const mongoose = require('mongoose');
const utility = require('../libs/utility');

const model = mongoose.model('exam');
const event = mongoose.model('event');
const user = mongoose.model('user');


function addNewExam(res, examObj, index) {
	let exam = new model({
    	course_code: examObj.course,
    	date: examObj.date,
    	start: examObj.start,
    	end: examObj.end,
    	duration: examObj.duration,
    	location: examObj.location,
    	instructor: examObj.instructor
    });
	exam.save(examObj)
		.then((function(doc) {
			if (index)
				res.send({
            		error: 0,
            		data: "Finished"
           		});
		}))
		.catch(function (err) {
			logger.debug("error adding course " + examObj.course + " because: "+ err);
			res.send({
            	error: 110,
            	data: "error adding course " + examObj.course + " because: "+ err
            });
		});
}

function getExam(req, res, next) {
	logger.debug("fetching exam");
	model.findOne({course_code: req.query.course})
		.then(function (exam) {
			if (exam === null) {
				res.send({
					error: 110,
					data: "exam not found. "
				});
			} else {
				res.send({
					error: 0,
					data: exam
				});
			}
		})
		.catch(function (err) {
			res.send({
				error: 110,
				data: "Unknown error."
			});
		})
		.finally(next);
}

function updateExam(req, res, next) {
	let updated = {
		course_code: req.body.course,
    	date: req.body.title.date ? new Date(req.body.date) : undefined,
		start: req.body.start,
		end: req.body.end,
    	duration: req.body.duration,
    	location: req.body.location,
    	instructor: req.body.instructor
	};
	utility.removeUndefined(updated);
	model.findByIdAndUpdate(req.body.course, updated)
		.then(function (doc) {
			res.send({
				error: 0,
				data: doc
			});
		})
		.catch(function (err) {
			res.send({
				error: 110,
				data: err
			});
		})
		.finally(next);
}



function collectExams(req, res, next) {
	logger.debug("collecting exams");
	console.log(req.body.fileName);
	fs.readFile(('./../examwebscraper/exampages/UTM/'+ req.body.fileName), function (err,data){
    	if (err === null){
    		var index = false;
    		var examsObj = JSON.parse(data);
    		for (var i =0; i < examsObj.length; i++ ){
    			var newExam = {
    				course : examsObj[i][0],
    				duration : examsObj[i][1][0][1],
    			 	date : examsObj[i][1][1][1],
    			 	start : examsObj[i][1][2][1],
    			 	end : examsObj[i][1][3][1],
    			 	location : examsObj[i][1][4][1],
    			 	instructor : examsObj[i][1][5][1],
    			}

				// -- get rid of unnecessary characters from the date string
    			var properDate = newExam.date.replace(/\./g, "");
    			if(typeof(req.body.year) !== 'undefined' ){
    				properDate += (", " + req.body.year);
    			} else {
    				properDate += (", " + new Date().getFullYear());
    			}
				properDate = properDate.substring( properDate.indexOf(",")+2, properDate.length);
				properDate = properDate.replace("th,", ",");
                properDate = properDate.replace("st,", ",");
                properDate = properDate.replace("rd,", ",");
                properDate = properDate.replace("nd,", ",");

                // -- convert date to milliseconds
				var dateTemplate = Date.parse(properDate);

                // -- convert to date format
				var newDate = new Date(dateTemplate);

				// -- use start time to derive start date and time (for calendar)
				var startTime = moment(newExam.start, ["h A"]).format("H");
				startTime = startTime*3600000;
				startTime = startTime + dateTemplate;
				var startDate = new Date(startTime);

				// -- use end time to derive end date and time (for calendar)
                var endTime = moment(newExam.end, ["h A"]).format("H");
                endTime = endTime*3600000;
                endTime = endTime + dateTemplate;
                var endDate = new Date(endTime);


				// -- print values
				logger.debug(newExam.date);
				logger.debug(newExam.start);
				logger.debug(newExam.duration);
				logger.debug(newExam.end);
				logger.debug("CALCULATED: ----------------------------------------");
				logger.debug("Date: " + newDate.toString());
				logger.debug("StartDate: " + startDate.toString());
				logger.debug("EndDate: " + endDate.toString());
				logger.debug("");

				newExam.date = newDate;
				newExam.start = startDate;
				newExam.end = endDate;
				logger.debug("FINAL: ----------------------------------------");
				logger.debug(newExam);

				if (i == examsObj.length-1) index = true;
				addNewExam(res, newExam, index );
    		}

    	} else {
    		res.send({
              	error: 110,
                data: err
            });
    	}
    });
    next();
}

module.exports = function (server) {
	server.get('/api/exam', getExam);
	server.post('/api/exam', collectExams);

};
