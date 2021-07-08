const Post = require('../../../models/post');
const Comment = require('../../../models/comments');
exports.index = async function (req, res) {
  let posts = await (Post.find({})
    .sort('-createdAt')
    .populate('user')
    .populate({
      path: 'comment',
      populate: {
        path: 'user'
      }
    }));
  return res.status(200).json({
    message: "list of posts",
    posts: posts,
  })
}

module.exports.destroy = async function (req, res) {

  try {
    // .id means the converting Object Id into string
    let post = await Post.findById(req.params.id);
    if (post.user == req.user.id) {
      await post.remove();
      await Comment.deleteMany({ post: req.params.id });
      return res.status(200).json({
        message: " Post and Associated comments are deleted successfully",
      });
    } else {
      return res.status(401).json({
        message: 'you cannot delete this post',
      })
    }
  } catch (err) {
    return res.status(200).json({
      message: `interval server error `,
    })
  }

}
