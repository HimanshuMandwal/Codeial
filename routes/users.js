const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users_controller');
const passport = require('passport');

router.get('/profile/:id',passport.checkAuthentication,usersController.profile);

router.post('/update/:id', passport.checkAuthentication, usersController.update);

router.get('/sign-up',usersController.signUp);

router.get('/sign-in',usersController.signIn);

router.get('/sign-out',usersController.destroySession);

router.post('/create',usersController.create);

//use passport as a middleware to authentication
router.post('/create-session',passport.authenticate( //if this authentication successfully happens than it will return else lead to fauilure redirect
  'local',//stretagy that we are using
  {failureRedirect: '/user/sign-in'} //if not done than this will lead to this route
),usersController.createSession);


module.exports = router;