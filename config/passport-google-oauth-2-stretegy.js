const passport = require('passport');
const googleStretegy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

//tell passport to use new stretegy
passport.use(new googleStretegy({
  clientID: '148416018275-kvlu1vtn6e8fvi3ucjcu37tgg0thdd6e.apps.googleusercontent.com',
  clientSecret: 'ExH7S7pvvzCfRaA_Ej5WDLEQ',
  callbackURL: 'http://localhost:8000/user/auth/google/callback',
},
  (accessToken, refreshToken, profile, done) => {
    User.findOne({ email: profile.emails[0].value }).exec(
      function (error, user) {
        if (error) {
          console.error("error in google stretagy " + error);
          return;
        }
        console.log(profile);
        if (user) {

          // if found set this user as request.user
          return done(null, user);
        } else {
          //if user not found create the user and set it to request.user
          User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: crypto.randomBytes(20).toString('hex'),
          }, function(error, users){
            if(error){
              console.error(`error in adding user to DB via google oauth ${error}`);
              return;
            }
            return done(null , users);
          })
        }
      }
    )
 })
)

module.exports = passport;