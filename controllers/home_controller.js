module.exports.home = function (req, res) {
  // console.log(req.cookies); for displaying cookies
  // res.cookie('user_id',34); for additing the cookies
  return res.render('home', {
    title: 'home'
  });
};
