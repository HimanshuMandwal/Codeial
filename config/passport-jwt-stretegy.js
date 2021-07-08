const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const User = require('../models/user');

let opts = {
  secretOrKey: 'codial',
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
};

passport.use(new JWTStrategy(opts, function (jwtPayload, done) {
  User.findById(jwtPayload._id, function (err, user) {
    if (err) {
      console.error(`Error in finding user from JWT ${err}`);
    }
    if (user) {
      return done(null, user)
    } else {
      return done(null, false);
    }
  });
}));