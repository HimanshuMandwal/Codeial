const { model, user } = require('../config/mongoose');
const User = require('../models/user');
module.exports.profile = function (req, res) {
  return res.render('user_profile', {
    title: 'user | profile',
  });
}

//render the sign up page
module.exports.signUp = function (req, res) {
  if(req.isAuthenticated()){
    return res.redirect('/user/profile');
  }
  return res.render('user_sign_up', {
    title: 'codial | sign Up'
  })
}

//render the sign in page
module.exports.signIn = function (req, res) {
  if(req.isAuthenticated()){
    return res.redirect('/user/profile');
  }
  return res.render('user_sign_In', {
    title: 'codial | sign In'
  })
}

// get the sign up data
module.exports.create = function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    res.redirect('back');
  }
  //finding in DB
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log(`Error :: in finding up the user in signing Up ::${err}`);
      return;
    }
    //not in DB then create the user
    if (!user) {
      User.create(req.body, function (err, user) {
        if (err) {
          console.log(`Error :: in creating up the user in signing Up ::${err}`);
          return;
        }

        return res.redirect('/user/sign-in');

      })
    } else {
      res.redirect('back');
    }
  })
}

// sign in and create the session for login
module.exports.createSession = function (req, res) {
  return res.redirect('/');
}

module.exports.destroySession = function(req, res) {
  req.logout(); //given by the passport to logout any user
  return res.redirect('/');
}