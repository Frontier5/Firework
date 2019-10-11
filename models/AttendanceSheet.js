var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var CourseSchema = new Schema({
	course_id: { type: ObjectId, required: true },
	credits: { type: Number, required: true},
	
})

var AttendanceSchema = new Schema({
	roll_number: { type: ObjectId, required: true },
	sem_1: { type: [CourseSchema] }
});

module.exports = mongoose.model('Attendance', AttendanceSchema, "AttendanceSheets");