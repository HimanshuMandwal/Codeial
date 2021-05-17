const e = require('express');
const Post = require('../models/post');//schema imported
const Comment = require('../models/comments');

module.exports.post = function (req, res) {
  return res.render('posts', {
    title: 'Posts'
  });
};

module.exports.create = async function (req, res) {
  try {
    let post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    })
    if(req.xhr){
      return res.status(200).json({
        data: {
          post:post
        },
        message:"post created !"
      })
    }
    req.flash('success', 'post published !');
    return res.redirect('back');
  } catch (err) {
    console.log(`Error In creating the post :: ${err}`);
    req.flash('error', err);
    return res.redirect('back');
  }

}

module.exports.destroy = async function (req, res) {

  try {
    // .id means the converting Object Id into string
    let post = await Post.findById(req.params.id);
    if (post.user == req.user.id) {
      await post.remove();
      await Comment.deleteMany({ post: req.params.id });
      if( req.xhr) {
        return res.status(200).json({
          data: {
            post_id:req.params.id,
          },
          message:"post deleted !"
        })
      }
      req.flash('success', 'post and associated comments destroyed!');
      return res.redirect('back');
    } else {
      req.flash('error', ' you cannot delete this post ');
      return res.redirect('back');
    }
  } catch (err) {
    req.flash('error', err);
    return res.redirect('back');
  }

}
