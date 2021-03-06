const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  //include tha array of Ids of comments that are associated with this post
  comment: [
    {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'Comment',
    }
  ]
},
  { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;