const mongoose = require('mongoose');
const { id } = require('../config/mongoose');
const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = function (req, res) {
  // console.log(req.cookies); for displaying cookies
  // res.cookie('user_id',34); for additing the cookies
  Post.find({}).populate('user').exec(function(err,posts){ //used the populate function to pre-populate the particular objectIds data
    if(err){
      console.log(`Error In getting the post :: ${err}`);
    }
    console.log(posts);
    return res.render('home', {
      posts:posts,
      title: 'home'
    })
  });
};
