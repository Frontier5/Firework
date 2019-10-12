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
			if (isMatch) {
				// If password matches, generate token and send;
				console.log(authenticate.getStudentToken(roll));
				res.send(authenticate.getStudentToken(roll));
			}
			else {
				res.send("not match");
			};
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

router.post('/change', jwt({secret: config.secret}), authenticate.checkStudent, (req, res, next) => {
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
		res.setHeader('Content-Type', 'application/json');
		Student.findOne({ roll_number: req.body.roll_number })
			.then((User) => {
				const mailOptions = {
					from: config.mailer.username, // sender's address
					to: User.email, // receiver's address
					subject: 'Password Reset', // Subject line
					html: '<h1>If you received this email, you previously registered and requested to reset your password</h1>'// plain text body
				};
				transporter.sendMail(mailOptions, function (err) {
					if (err) res.status(500).json({ err: err });
					else res.status(200).json({ success: true, status: 'Email sent successfully!' });
				});
			}).catch((err) => {
				res.status(500).json({ success: false, status: 'No account is registered with that email' });
			});
	} else res.status(400).json({ success: false, status: 'No email is entered' });
});

router.post('/reset/:token', (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	User.findOne({ reset_token: req.params.token })
		.then((user) => {
			if (req.body.password1 === req.body.password2) {
				User.update({ 'username': user.username }, { $set: { 'password': req.body.password1 } })
					.then((user) => {
						res.status(202).json({ success: true, status: 'Password successfully updated!' });
					})
					.catch((err) => {
						res.status(500).json({ success: true, status: 'Password not updated' });
					})
			}
			else {
				res.status(400).json({ success: false, status: 'The passwords do not match' });
			}
			user.save(function (err, user) {
				if (err) return new (err);
				else console.log(user.username + "'s password is reset");
			});
		})
		.catch((err) => res.status(403).json({ success: false, status: 'Invalid route', error: err }) );
});

module.exports = router;