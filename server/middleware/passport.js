require('./../config/config');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const {User} = require('./../models/user');


module.exports = (passport) => {
  let opts = {};

	opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
	opts.secretOrKey = process.env.JWT_SECRET;
	passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
		User.getUserById(jwt_payload._doc._id, (err, user) => {
			if (err) {
				return done(err, false);
			}

			if (!user) {
				return done(null, false);
			}
			return done(null, user);
		});
	}));

};
