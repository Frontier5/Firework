const jwt = require('jsonwebtoken');
const config = require('../config');

// Auth protected route configs
function checkAdmin(req, res, next) {
	if (req.user.role == 'admin') {
		next();
	} else {
		res.sendStatus(403);
	}
}

function checkStudent(req, res, next) {
	if (req.user.role == 'student') {
		next();
	} else {
		res.sendStatus(403)
	}
}

function checkFaculty(req, res, next) {
	if (req.user.role == 'faculty') {
		next();
	} else {
		res.sendStatus(403);
	}
}

function getStudentToken(roll_number) {
	return jwt.sign(
		{
			roll_number: roll_number,
			role: 'student'
		},
		config.secret
	);
}

function decodeToken(token) {
	return jwt.decode(token);
}

function getStudentResetToken(roll_number) {
	return jwt.sign(
		{
			roll_number: roll_number,
		},
		config.reset_secret_key,
		{
			expiresIn: '1h'
		}
	)
}

module.exports = {
	checkAdmin,
	checkStudent,
	checkFaculty,
	getStudentToken,
	getStudentResetToken,
	decodeToken
}