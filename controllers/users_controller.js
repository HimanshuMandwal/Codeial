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
module.exports.create = async function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    req.flash("error","confirm password and password not matched");
    return res.redirect('back');
  }
  //finding in DB
  try {
    let user = await User.findOne({ email: req.body.email });
      //not in DB then create the user
      if (!user) {
          await User.create(req.body);
          req.flash("success","sign up successfull");
          return res.redirect('/user/sign-in');
      } else {
        req.flash("warning","user already exists")
        return res.redirect('back');
      }

  } catch(e) {
    req.flash("error","error in sign up");
    return res.redirect("back");
  }

}

// sign in and create the session for login
module.exports.createSession = function (req, res) {
  req.flash('success','Logged in Successfully');
  return res.redirect('/');
}

module.exports.destroySession = function(req, res) {
  req.logout(); //given by the passport to logout any user
  req.flash('success','you have logged out');
  return res.redirect('/');
}

