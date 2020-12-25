const { model, user } = require('../config/mongoose');
const User = require('../models/user');
module.exports.profile = function (req, res) {
  if(req.cookies.user_id ){
    User.findById(req.cookies.user_id , function(err,user){
      if(err) {
        console.log(`ERROR :: finding the user for Profile page :: ${err}`);
        return res.redirect('/user/sign-in');
      }
      if(!user) {
        return res.redirect('user/sign-in');
      } else {
        return res.render('user_profile', {
          title: 'user | profile',
          name: user.name,
          email: user.email,
        });
      }
    });
  } else  {   //here we cannot able to remove this else here as the above code is working
    // asyncronously without await so this function hits two return and gives error handle it in upcomming lectures
    return res.redirect('/user/sign-in');
  }

}

//render the sign up page
module.exports.signUp = function (req, res) {
  if(!req.cookies.user_id) {
    return res.render('user_sign_up', {
      title: 'codial | sign Up'
    })
  } else {
    return res.redirect('/user/profile');
  }
}

//render the sign in page
module.exports.signIn = function (req, res) {
  if(req.cookies.user_id ) {
    User.findById(req.cookies.user_id , function(err,user){
      if(err) {
        console.log(`ERROR :: finding the user for Profile page :: ${err}`);
        return res.redirect('/user/sign-in');
      }
      if(!user) {
        return res.render('user_sign_In', {
          title: 'codial | sign In'
        })
      } else {
        return res.render('user_profile', {
          title: 'user | profile',
          name: user.name,
          email: user.email,
        });
      }
    });
  } else {
    return res.render('user_sign_In', {
      title: 'codial | sign In'
    });
  }

}

// get the sign up data
module.exports.create = function (req, res) {
  if(!req.cookies.user_id){
    if (req.body.password != req.body.confirm_password) {
      console.log('Error :: password does not match with confirm password ');
      return res.redirect('back');
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
        return res.redirect('/user/sign-in');
      }
    })
  } else {
    return res.redirect('/user/profile');
  }
}

// sign in and create the session for login
module.exports.createSession = function (req, res) {
  //steps
  //find the user
  if(!req.cookies.user_id) {
    User.findOne({ email: req.body.email }, function (err, user) {
      if (err) {
        console.log(`Error :: in finding up the user in signing In ::${err}`);
        return;
      }
      //handle if the user found
      if (user) {
        //handle password which don't match
        //handle creation session creation
        if(user.password != req.body.password ) {
          return res.redirect('back');
        }
        res.cookie('user_id',user.id);
        return res.redirect('/user/profile');
      } else {
        //handle if user not found
        res.redirect('back');
      }


    })
  } else {
    return res.redirect('/user/profile');
  }
}

module.exports.signOut = function(req,res) {
  if(req.cookies.user_id) {
    res.clearCookie('user_id');
    return res.redirect('/user/sign-in');
  } else {
    return res.redirect('back');
  }
}