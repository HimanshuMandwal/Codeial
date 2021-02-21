const e = require('express');
const Post = require('../models/post');//schema imported

module.exports.post = function(req,res){
    return res.render('posts',{
        title:'Posts'
    });
};

module.exports.create = function(req, res) {
  Post.create({
    content: req.body.content,
    user: req.user._id,
  },(err, post)=>{
    if(err) {
      console.log(`Error In creating the post :: ${err}`);
    }
    return res.redirect('back');
  })
}

