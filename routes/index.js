//this is entry point to all the routes
const express = require('express');
const router = express.Router();
const homeController=require('../controllers/home_controller');

console.log('router is loaded');


router.get('/',homeController.home);
router.use('/user',require('./users'));//use is used here as this lacalhost:8000/users/.. can send a get and a post request it is handled in users.js file
router.use('/post',require('./posts'));
router.use('/comment',require('./comment'));
//for any further routes  access from here
//router.use('./routerName',require('./routerFile'));
router.use('/api', require('./api'));

module.exports=router;