const logger = require('winston');

const exec = global.Promise.promisify(require('child_process').exec);
const mongoose = require('mongoose');
const readline = require('readline');
const utility = require('../libs/utility');

const course = mongoose.model('course');
const template = mongoose.model('courseTemplate');
const user = mongoose.model('user');

function getSections(meetingSections) {
	let sectionObject = {
		primary: null,
		lectures: [],
		tutorials: [],
		practicals: []
	};
	for (let i = 0; i < meetingSections.length; i++) {
		if (meetingSections[i].instructors.length != 0) {
			sectionObject.primary = meetingSections[i];
		}
		if (meetingSections[i].code.startsWith('L')) {
			sectionObject.lectures.push(meetingSections[i]);
		} else if (meetingSections[i].code.startsWith('T')) {
			sectionObject.tutorials.push(meetingSections[i]);
		} else if (meetingSections[i].code.startsWith('P')) {
			sectionObject.practicals.push(meetingSections[i]);
		}
	}
	return sectionObject;
}

function processFile(file) {
	return exec('java -jar ../parser/Parser-jar-with-dependencies.jar "' + file.path + '"')
		.then(function (stdout) {
			let parsedData = JSON.parse(stdout);
			let sections = getSections(parsedData.meeting_sections);
			let templateData = new template({
				hash: file.hash,
				course_code: parsedData.code,
				instructor: sections.primary.instructors[0],
				description: parsedData.description,
				lectures: sections.lectures,
				tutorials: sections.tutorials,
				practicals: sections.practicals,
				office_hours: sections.office_hours,
				office_location: sections.office_location
			});
			return templateData.save(templateData);
		});
}

function parse(req, res, next) {
	template.findOne({hash: req.files.file.hash})
		.then(function (doc) {
			if (doc === null) {
				return processFile(req.files.file);
			} else {
				return doc;
			}
		})
		.then(function (doc) {
			let courseData = new course({
				code: doc.course_code,
				instructor: doc.instructor,
				description: doc.description,
				lectureSelected: req.body.lectureSelected,
				lectures: doc.lectures,
				tutorialSelected: req.body.tutorialSelected,
				tutorials: doc.tutorials,
				practicalSelected: req.body.practicalSelected,
				practicals: doc.practicals,
				office_hours: doc.office_hours,
				office_location: doc.office_location,
				exams: true
			});
			return courseData.save(courseData);
		})
		.then(function (doc) {
			return user.update({_id: req.body.user}, {$push: {course_ids: doc.id}});
		})
		.then(function (doc) {
			res.send(200);
		})
		.catch(function (err) {
			let failedPdfExp = new RegExp('.*IOException.*');
			if (failedPdfExp.test(err)) {
				res.send(415);
			} else {
				res.send(520);
			}
		})
		.finally(next);
}

module.exports = function (server) {
	server.post('/api/parse', parse);
};
