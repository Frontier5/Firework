const express = require('express');
const jwt = require('express-jwt');
const authenticate = require('../utils/authenticate');
const Course = require('../models/Course');
const Student = require('../models/Student');
const router = express.Router();

// If no token, throw back, if token -> check role for student, if not student, throw back

router.use((req, res, next) => {
	if (req.user) {
		console.log("JWT token detected");
		next();
	} else {

	}
});

// Get all attendance details of a single student
router.post('/student', authenticate.checkAdmin, jwt({ secret: "bigblackbentlys" }), (req, res) => {
	const roll_number = req.body.roll_number;

	Student.findById(roll_number, (err, student) => {
		if (err) res.send(err);
		else {
			Course.find({ 'course_id': { $in: student.enrolled_courses } }, (error, resp) => {
				if (error) res.send(error);
				else {
					res.json(resp);
				}
			});
		}
	});
});

// Add a sheet of attendance (faculty updates a day of attendance)
router.post('/add', (req, res) => {
	const course_id = req.body.course_id;
	const date = req.body.date;
	const class_duration = req.body.class_duration;
	const class_type = req.body.class_type;
	// TODO: Validation required -> should be an array of objects ( [{ roll_number: present_or_not }] )
	const updatedAttendances = req.body.updatedList;

	Course.findById(course_id, (err, resp) => {
		if (err) res.send(err);
		else {
			const class_attendance = {
				date: date,
				class_duration: class_duration,
				class_type: class_type,
				students: updatedAttendances
			}
			resp.attendance_sheet.push(class_attendance);
			resp.save((err) => {
				if (err) res.send(err)
				else {
					res.send("Update successful")
				}
			});
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
