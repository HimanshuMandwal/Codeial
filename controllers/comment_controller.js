const Comment = require('../models/comments');
const Post = require('../models/post');
module.exports.create = async function(req, res) {
  try {
    let post  = await Post.findById(req.body.post )
    if(post) {
     let comment = await Comment.create({content: req.body.content,post: req.body.post,user: req.user._id,});
      await post.comment.push(comment);
      await post.save() //this function is used whenever we update the data inside a object saved in database
      req.flash("success","comment is added successfully" );
      return res.redirect('back');
    }
  } catch(err) {
    console.log(`Error in Finding the Post For the comment ${err}`);
    req.flash("error","error in adding comment" );
    return res.redirect('back');
  }
}

module.exports.destroy = async function(req, res) {
  let comment = await Comment.findById(req.params.id);
    try{
      if(comment.user == req.user.id) {
        let postId = comment.post;
        await comment.remove();
        let post =  await Post.findByIdAndUpdate(postId,{$pull:{comment:req.params.id}});
        if(post) {
          req.flash("success" , "comment deleted succesfully");
          return res.redirect('back');
        }
      } else {
        req.flash("warning" , "you are not authenticate to delete the comment");
        return res.redirect('back');
      }

    } catch(e){
      req.flash("error" , "error in deleting comment");
      console.log('Error in deleting the comment '+e);
      return res.redirect('back');
    }

}