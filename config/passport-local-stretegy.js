
const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

//authentication using passport
passport.use(new LocalStrategy({ //telling passport to use localStrategy
  usernameField: 'email', //email is the username field for US
  passReqToCallback: true, //this allows up to get the first argument as equest
  },
  function(req,email,password,done) {
    User.findOne({email:email},function(err,user) {
      if(err) {
        // console.log(`passport::Error In finding user ${err}`);
        req.flash('error',err);
        return done(err);
      }

      if(!user || user.password != password) {
        req.flash('error',"Invalid UserName/Password");
        return done(null,false);
      }
      return done(null,user);
    });
  }
));


//serializing the user to decide which key is kept in the cookies

passport.serializeUser(function(user,done){
  done(null,user.id);
})
//deserializing the user from the key in cookies that is find the user and fetch which user is signin and making the request

passport.deserializeUser(function(id,done){
  User.findById(id,function(err,user){
    if(err) {
      console.log(`Passport::deserialize:: error in finding user ${err}`);
    }
    return done(null, user);
  })
});
/*               sending data of the current user to views                 */

//check if the user is authenticated already
passport.checkAuthentication = function(req,res,next) { //this function  act like a middleware
  //this is when the user is signed in then pass on to the next function(controller function)
  if(req.isAuthenticated()) {
    return next();
  }
  //if the user is not signed in
  return res.redirect('/user/sign-in');
}

//this is to set up the user fo views
passport.setAuthenticatedUser = function(req,res,next) {
  if(req.isAuthenticated()) {
    //req.user contains the current signed in user and we are just sending this to locals for the views
    res.locals.user = req.user; //req.user is handled by the passportjs

  }
  next();
}



module.exports = passport;