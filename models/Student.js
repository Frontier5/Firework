var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.SchemaTypes.ObjectId;

var User = new Schema({
	firstname: {
		type: String
	},
	lastname: {
		type: String
	},
	admin: {
		type: Boolean,
		default: false
	},
	role: {
		type: String
	},
	email: {
		type: String
	},
	mobile_no: {
		type: Number
	}
});

module.exports = mongoose.model('User', User);