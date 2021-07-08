const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function (req, res) { //to have a async statements inside the function needs to be defined as async
  // console.log(req.cookies); for displaying cookies
  // res.cookie('user_id',34); for additing the cookies
  try {
    let posts = await (Post.find({})
      .sort('-createdAt')
      .populate('user')
      .populate({
        path: 'comment',
        populate: {
          path: 'user'
        }
      })) ;
    let users = await User.find({}); //this successfull response is stored in the users variable and the flow of the code goes to next iteration only after completing this statement
    return res.render('home', {
      posts: posts,
      title: 'home',
      allUsers: users,
    });

  } catch (err) {
    console.error(`error in homeController::home :: ${err}`);
    return;
  }
};

//one of the basic use of the async and await thing is to get rid of this function inside function nesting and as well we
// can use .then() to resolve the promises but this as well also leads to that nesting so we use async and await to overcome this issues