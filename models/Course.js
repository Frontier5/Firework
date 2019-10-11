var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var RollAttendance = new Schema({
	roll_number: {type: Number, required: true},
	present: {type: Boolean, required: true}
});

var AttendanceSchema = new Schema({
	date: { type: Date, required: true },
	class_duration: { type: Number, required: true},
	class_type: { type: String, required: true },
	students: { type: [RollAttendance] }
});

var CourseSchema = new Schema({
	course_id: { type: ObjectId, required: true },
	credits: { type: Number, required: true },
	course_instructor: { type: String, required: true },
	enrolled_students: { type: [Number] },
	attendance_sheet: { type: [AttendanceSchema] }
});

module.exports = mongoose.model("Course", CourseSchema, "Courses");