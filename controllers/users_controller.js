const { model, user } = require('../config/mongoose');
const User = require('../models/user');
module.exports.profile = async function (req, res) {
  try {
    let user = await User.findById(req.params.id );

    return res.render('user_profile', {
      title: 'user | profile',
      profileUser: user,
    });

  } catch(err) {

    console.error(`users_controller::Error in getting the profile of user :: ${err}`);
    return res.redirect('back');
  }
}

module.exports.update = async function(req , res) {
  if(req.user.id == req.params.id) {
    try {
      await User.findByIdAndUpdate(req.params.id );
      return res.redirect('back');
    } catch(e){
      console.error(`Error in the updating the users info ${err}`);
      return res.redirect('back');
    }
  } else {
    res.status(401).send('unauthorized');
  }
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

