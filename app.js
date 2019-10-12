const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const config = require('./config');

const indexRouter = require('./routes/index');
const studentAuthRouter = require('./routes/auth/student');
const attendanceRouter = require('./routes/attendance');

const app = express();

// Connect to Mongoose
mongoose.connect(
	config.mongo_uri,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	},
	(err) => {
		if (err) {
			console.log(err);
		} else {
			console.log("Connected to Laniakea");
		}
	}
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));

const allowedOrigins = ['http://localhost:3000', 'http://yourapp.com'];
app.use(cors({
	origin: function (origin, callback) {
		// allow requests with no origin 
		// (like mobile apps or curl requests)
		if (!origin) return callback(null, true); if (allowedOrigins.indexOf(origin) === -1) {
			var msg = 'The CORS policy for this site does not ' +
				'allow access from the specified Origin.';
			return callback(new Error(msg), false);
		} return callback(null, true);
	}
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/attendance', attendanceRouter);
app.use('/auth/student', studentAuthRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
