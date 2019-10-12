const express = require('express');
const jwt = require('express-jwt');
const config = require('../../config');
const transporter = require('../../utils/mailer');
const authenticate = require('../../utils/authenticate');
const Student = require('../../models/Student');
const router = express.Router();

// Testing path
router.post('/login', (req, res, next) => {
	const roll = req.body.roll_number;
	const password = req.body.password;

	Student.findById(roll, (err, student) => {
		student.comparePassword(password, (err, isMatch) => {
			if (isMatch) res.send(authenticate.getStudentToken(roll));
			else res.send("Not match");
		});
	});
});

router.post('/add-test-student', (req, res) => {
	Student.create({
		_id: "170330021",
		password: "abhishekTheBombAss",
		current_sem: 3,
		first_name: "Abhishek",
		last_name: "Kasireddy",
		college_email: "a.kasireddy@klh.edu.in",
		guardian_number: "9676333766"
	}).then((doc) => {
		res.send(doc);
	}).catch((reason) => {
		res.send(reason);
	});
});

router.post('/change', jwt({ secret: config.secret }), authenticate.checkStudent, (req, res, next) => {
	// Since change password only occurs after student has already
	// logged in, we can just look at the token to get their roll_number
	// and keep them signed in

	// body contains current password, and new password
	Student.findById(req.user.roll_number, (err, student) => {
		if (err) res.status(403).send("Invalid token");
		else {
			const new_pass = req.body.new_pass;
			student.password = new_pass;
			student.save((err, student) => {
				if (err) res.status(500).send(err);
				else res.send("saved -> " + student);
			});
		}
	});
});

router.post('/forgot', (req, res) => {
	if (req.body.roll_number) {
		console.log(req.body.roll_number);
		res.setHeader('Content-Type', 'application/json');
		Student.findById(req.body.roll_number, (err, student) => {
			if (err) res.status(500).json({ status: "Couldn't find that roll_number", err: err });
			else {
				const token = authenticate.getStudentResetToken(student._id);
				console.log(token);
				const mailOptions = {
					from: config.mailer.username, // sender's address
					to: student.college_email, // receiver's address
					subject: 'Password Reset', // Subject line
					html: `<a href='http://localhost:3000/auth/student/reset/${token}'>Click here to reset your password</a>`
				};
				transporter.sendMail(mailOptions, (err) => {
					if (err) res.status(500).json({ err: err });
					else res.status(200).json({ success: true, status: 'Email sent successfully!' });
				});
			}
		});
	} else res.status(400).json({ success: false, status: 'No email is entered' });
});

router.get('/reset/:token', (req, res) => {
	res.render('reset', { token: req.params.token });
});

router.post('/reset', (req, res) => {
	// TODO: Body contains token so verify again and save model with new password
	// Right now we're only decoding without verifying signature
	const decoded = authenticate.decodeToken(req.body.token);
	const roll_number = decoded.roll_number;
	const password = req.body.password;
	Student.findById(roll_number, (err, student) => {
		if (err) res.status(500).send(err);
		else {
			student.password = password;
			student.save((error) => {
				if (error) res.status(500).send(error);
				else res.send("changed password");
			});
		}
	});
});

module.exports = router;