const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

//  TODO: Needs a peer review and testing

const RollAttendance = new Schema({
	roll_number: { type: Number, required: true },
	present: { type: Boolean, required: true }
});

const AttendanceSchema = new Schema({
	date: { type: Date, required: true },
	class_duration: { type: Number, required: true },
	class_type: { type: String, required: true },
	students: { type: [RollAttendance] }
});

const StudentAttendanceSchema = new Schema({
	roll_number: { type: String, required: true },
	labs_attended: { type: Number, default: 0 },
	lectures_attended: { type: Number, default: 0 },
	skilling_sessions_attended: { type: Number, default: 0 }
});

const AttendanceStructureSchema = new Schema({
	labs_conducted: { type: Number, required: true, default: 0 },
	lectures_conducted: { type: Number, required: true, default: 0 },
	skilling_sessions_conducted: { type: Number, required: true, default: 0 },
	attendance_sheet: { type: [AttendanceSchema] },
	attendance_by_student: { type: [StudentAttendanceSchema] }
});

const AssignmentSchema = new Schema({
	assignment_number: { type: Number, required: true },
	max_marks: { type: Number, required: true },
	scored_marks: { type: Number, required: true }
});

const ExamSchema = new Schema({
	mid: { type: Number, required: true, min: 1, max: 2 },
	component: { type: String, required: true },
	max_marks: { type: Number, required: true },
	scored_marks: { type: Number, required: true }
});

const MarksSchema = new Schema({
	assignments: { type: [AssignmentSchema] },
	internal_exams: { type: [ExamSchema] },
	total_internals: { type: Number }
});

const StudentSchema = new Schema({
	roll_number: { type: String, required: true },
	// TODO: We can update the student's attendance during pre save when faculty batch updates the attendance sheet
	marks: { type: MarksSchema },
	// Grade not required until course status gets updated. When course status gets updates, add a job in the
	// scheduler that processes each student
	grade: { type: String }
});

const CourseSchema = new Schema({
	_id: { type: String, required: true },
	status: { type: String, required: true },
	credits: { type: Number, required: true },
	course_instructor: { type: String, required: true },
	enrolled_students: { type: [StudentSchema] },
	attendance: { type: AttendanceStructureSchema }
});

//	STRUCTURE DECOMPOSITION
//	Each course a course id, status (finished, ongoing), credits, 
//	course_instructor(id to faculty), and a list of enrolled students
//		
// 		Each student has a roll number, and a list of assignments,
//		and list of exams and a total internals number that will
//		get updated on pre-save
//				
// 		The course also has a list of attendances. Each element in this list is  
// 		a date and the list of roll_numbers that have attended that day

// 	The thinking behind this is that marks won't will be needed on a per student
//	basis usually. So we store them according to roll_numbers.

// 	Attendance will also be needed on a per student basis, but the faculty needs
//	to batch update the attendance so this approach is easer.

// PRESAVE METHODS

// Whenever attendance_sheet gets updated, make sure all enrolled students get updated
// CourseSchema.pre('save', (course) => {
// 	if (course.)
// });

module.exports = mongoose.model("Course", CourseSchema, "courses");