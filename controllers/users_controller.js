const User = require('../models/user');
const fs = require('fs');
const path = require('path');

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
      let user = await User.findById(req.params.id);
      User.uploadedAvatar(req , res , function(err){
        if(err) {
          console.error("Error in multer ");
        }
        //this uploadAvatar is like middleware and process the multipart/form-data type of request and added some details regarding file
        //in the req.file object
        user.name = req.body.name;
        user.email = req.body.email;// we are only able to get read the body only because we have used the multer here
        if(req.file) {
          // this will be run only when file is uplaoded and just saves the path of the file that is given by multer for DB purpose
          if(user.avatar && fs.existsSync(path.join(__dirname,'..'+"/"+user.avatar))){
              fs.unlinkSync(path.join(__dirname,'..'+"/"+user.avatar));
          }
          user.avatar = User.avatarPath+"/"+req.file.filename;
        }
         user.save();
      })
      return res.redirect("back");
    } catch(e){
      console.error(`Error in the updating the users info ${e}`);
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

