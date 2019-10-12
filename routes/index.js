var express = require('express');
var router = express.Router();

// Auth protected route

// If no token, throw back, if token -> check role for student, if not student, throw back

router.get('/', function (req, res, next) {
	
});

module.exports = router;
