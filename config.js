const env = process.env.NODE_ENV;

const dev = {
	secret: '12345-67890-09876-54321',
	reset_secret_key: '54321-09876-67890-12345',
	mongo_uri: 'mongodb+srv://alphaButtFucker:sullichiku@laniakea-1hblj.mongodb.net/klef?retryWrites=true',
	mailer: {
		service: 'gmail',
		username: 'achuth.r@klh.edu.in',
		password: '7981936393'
	}
};
const production = {
	// Pending Implementation
};

const config = {
	dev,
	production
};

module.exports = config[env];