var express = require('express');
var AttendanceSheets = require('../models/AttendanceSheet');
var Course = require('../models/Course');
var router = express.Router();

// Auth protected route

// If no token, throw back, if token -> check role for student, if not student, throw back

router.post('/student', (req, res) => {
	var roll_number = req.body.roll_number;

	AttendanceSheets.find({ roll_number: roll_number }, (err, resp) => {
		if (err) res.send(err);
		else {
			res.json(resp);
		}
	});
});

router.post('/update-batch', (req, res) => {
	var course_id = req.body.course_id;
	var updatedAttendances = req.body.updatedList;

	Course.findById(course_id, (err, resp) => {
		if (err) res.send(err);
		else {
			res.json(resp);
		}
	});
});


router.post('/batch', (req, res) => {
	// Get batch attendance details
	// Get students in the specified batch
	// Lookup Look up enrolled courses
	// Lookup attendance sheets for each course
	// Put each course attendance sheet in a separate sheet in excel
});

router.post('/', (req, res) => {
	res.send("Hi, this is the API endpoint for Firework Attendance");
});

module.exports = router;
