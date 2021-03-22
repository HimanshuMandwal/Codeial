const Comment = require('../models/comments');
const Post = require('../models/post');
module.exports.create = function(req, res) {
  Post.findById(req.body.post , function(err, post) {
    if(err) {
      console.log(`Error in Finding the Post For the comment ${err}`);
      res.redirect('back');
    }
    if(post) {
      Comment.create({
        content: req.body.content,
        post: req.body.post,
        user: req.user._id,
      }, (err, comment) =>{
        if(err) {
          console.log(`Error In creating the comment ${err} `);
        }
        post.comment.push(comment);
        post.save() //this function is used whenever we update the data inside a object saved in database
        res.redirect('back');
      })
    }
  })
}

module.exports.destroy = function(req, res) {
  Comment.findById(req.params.id, function(err, comment){
    if(err) {
      console.log('Error in deleting the comment '+err);
      return res.redirect('back');
    }
    console.log(comment);
    if(comment.user == req.user.id) {
      let postId = comment.post;
      comment.remove();
      Post.findByIdAndUpdate(postId,{$pull:{comment:req.params.id}},function(err, post){
        return res.redirect('back');
      });
    } else {
      return res.redirect('back');
    }
  })
}