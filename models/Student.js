const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const SALT_WORK_FACTOR = 5;

const Student = new Schema({
	_id: { type: String, required: true },
	password: { type: String, required: true },
	current_sem: { type: Number, required: true },
	first_name: { type: String, required: true },
	middle_name: { type: String },
	last_name: { type: String, required: true },
	college_email: { type: String, required: true },
	personal_email: { type: String },
	mobile_number: { type: Number },
	guardian_first_name: { type: Number },
	guardian_last_name: { type: Number },
	guardian_number: { type: String, required: true },
	guardian_email: { type: String },
	enrolled_courses: { type: [String] }
});

// ** FOR WHATEVER MOTHERFUCKING REASON, LAMBDA DECLARATIONS DON'T WORK			**
// ** WITH MONGOOSE MODEL METHODS. DON'T USE THEM IN THIS FILE YOU DUMB FUCK.	**

Student.pre('save', function (next) {
	const student = this;

	// Only hash the password if it has been modified (or is new)
	if (!student.isModified('password')) return next();

	// Hash the password again
	bcrypt.hash(student.password, SALT_WORK_FACTOR, function (err, hash) {
		console.log(hash);
		if (err) return next(err);

		// Set the hash in place of the cleartext password
		student.password = hash;
		next();
	});
});

Student.methods.comparePassword = function (inp_pass, cb) {
	console.log(this.password);
	bcrypt.compare(inp_pass, this.password, function (err, isMatch) {
		console.log(isMatch);
		if (err) return cb(err);
		return cb(null, isMatch);
	});
};

module.exports = mongoose.model('Student', Student, 'students');