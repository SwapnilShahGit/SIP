const logger = require('winston');
const fs = require('fs');
const moment = require('moment');
const exec = global.Promise.promisify(require('child_process').exec);
const mongoose = require('mongoose');
const coroutine = global.Promise.coroutine;
const model = mongoose.model('exam');
const template = mongoose.model('courseTemplate');

// -- time constants
const hourToMil = 3600000;
const dayToMil = 86400000;

function addNewExam(examObj, index) {
	let exam = new model({
    	course_code: examObj.course,
    	date: examObj.date,
    	start: examObj.start,
    	end: examObj.end,
    	duration: examObj.duration,
    	location: examObj.location,
    	instructor: examObj.instructor
    });
	model.findOneAndUpdate({course_code: examObj.course}, examObj, {upsert:true}, function(err, doc){
		if (err === null) {
			if (index)
				logger.debug({
					error: 0,
					data: "Finished collecting exams"
           		});
		} else {
			logger.error("error adding course " + examObj.course + " because: "+ err);
		}
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

function collectExams() {
	logger.debug("collecting exams");
	exec('python ./../examwebscraper/exampages/UTM/scraper.py')
		.then(function (stdout){
			if (stdout !== null){
				var index = false;
				var examsObj = JSON.parse(stdout);
				for (var i =0; i < examsObj.length; i++ ){
					var newExam = {
						course : examsObj[i][0],
						duration : examsObj[i][1][0][1],
						date : examsObj[i][1][1][1],
						start : examsObj[i][1][2][1],
						end : examsObj[i][1][3][1],
						location : examsObj[i][1][4][1],
						instructor : examsObj[i][1][5][1]
					}
					// -- get rid of unnecessary characters from the date string
					var properDate = newExam.date.replace(/\./g, "");
					properDate += (", " + new Date().getFullYear());
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
					startTime = startTime*hourToMil;
					startTime = startTime + dateTemplate;
					var startDate = new Date(startTime);
					// -- use end time to derive end date and time (for calendar)
					var endTime = moment(newExam.end, ["h A"]).format("H");
					endTime = endTime*hourToMil;
					endTime = endTime + dateTemplate;
					var endDate = new Date(endTime);
					newExam.date = newDate;
					newExam.start = startDate;
					newExam.end = endDate;

					if (i == examsObj.length-1) index = true;
					addNewExam(newExam, index);
				}
			} else {
				logger.error({
					error: 110,
					data: "cannot get info from scraper"
				});
			}
    });
	getCourseTemplateExam();
	setTimeout(collectExams, dayToMil);
}

// -- update exam section of coursetemplates
function getCourseTemplateExam() {
	template.find()
		.then(coroutine (function*(courseTemplates) {
			if (courseTemplates != null) {
				for (var courseTemplate in courseTemplates){
					var newExamInfo = "Exam not yet available";
					yield model.findOne({course_code: courseTemplates[courseTemplate].course_code})
						.then(function(exam){
							if (exam != null) {
								newExamInfo =
									moment(exam.date).format('MMMM Do, YYYY,') +
									" from " +
									moment(exam.start).format('h:mma') +
									" to " +
									moment(exam.end).format('h:mma') +
									" in room(s): " +
									exam.location + ".";
							}
							template.findOneAndUpdate({_id : courseTemplates[courseTemplate]._id}, {$set:{exam_info: newExamInfo}})
								.then(function (doc){
								})
								.catch(function (err) {
									logger.debug({
										error: 110,
										data: "Unknown error."
									});
								})
						})
				}
			} else {
				logger.debug("No course templates found");
			}
		}))
		.catch(function (err) {
			logger.debug("course template UNKNOWN ERROR: " + err);
		});
}

setTimeout(collectExams);

module.exports = function (server) {
	server.get('/api/exam', getExam);
};
