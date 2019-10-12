const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const RollAttendance = new Schema({
	roll_number: {type: Number, required: true},
	present: {type: Boolean, required: true}
});

const AttendanceSchema = new Schema({
	date: { type: Date, required: true },
	class_duration: { type: Number, required: true},
	class_type: { type: String, required: true },
	students: { type: [RollAttendance] }
});

const CourseSchema = new Schema({
	course_id: { type: ObjectId, required: true },
	credits: { type: Number, required: true },
	course_instructor: { type: String, required: true },
	enrolled_students: { type: [Number] },
	attendance_sheet: { type: [AttendanceSchema] }
});

module.exports = mongoose.model("Course", CourseSchema, "Courses");