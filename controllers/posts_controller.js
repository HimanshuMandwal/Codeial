const e = require('express');
const Post = require('../models/post');//schema imported
const Comment = require('../models/comments');

module.exports.post = function(req,res){
    return res.render('posts',{
        title:'Posts'
    });
};

module.exports.create = async function(req, res) {
  try{
    await Post.create({
      content: req.body.content,
      user: req.user._id,
    })
    return res.redirect('back');
  } catch(err) {
    console.log(`Error In creating the post :: ${err}`);
    return res.redirect('back');
  }

}

module.exports.destroy = function(req, res) {
  Post.findById(req.params.id, function(err, post){
    // .id means the converting Object Id into string
    if(err) {
      console.log(`Post::destroy:: there is error in deleting the post ${err}`);
      return res.redirect('back');
    }
    if(post.user.id == req.user.id) {
      post.remove();
      Comment.deleteMany({post : req.params.id}, function(err){ // delete  the comments associate with the post
        if(err) {
          console.log(`Post::destroy:: there is error in deleting the comment ${err}`);
        }
        res.redirect('back');
      })
    } else {
      res.redirect('back');
    }
  })
}
