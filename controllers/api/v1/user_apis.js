const User = require('../../../models/user');
const jwt = require('jsonwebtoken');

module.exports.createSession = async function (req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user || user.password != req.body.password) {
      return res.status(422).json( {
        message: "invalid user or password",
      })
    } else {
      return res.status(200).json({
        message: "sign in successfully , here is your token keep it secreate",
        data:{
          token: jwt.sign(user.toJSON(),'codial', {expiresIn:100000}),//time in miliseconds
        }
      })
    }
  } catch (e) {
    console.error('error in user_apis ', e);
    return res.status(500).json({
      message: "internal server error",
    })
  }

}