const mongoose = require('mongoose');


const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  //comment belongs to a user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  //comment belongs to a post
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }
},{ timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);//telling the mongoose that this is going to be a collection with name comment

module.exports = Comment;