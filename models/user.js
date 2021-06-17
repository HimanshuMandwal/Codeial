const mongoose = require('mongoose');

const multer = require('multer');
const path = require("path");
const AVATAR_PATH = path.join('/uploads/users/avatars');

const userSchema = new mongoose.Schema({
  email : {
    type: String,
    required: true,
    unique: true,
  },
  password : {
    type: String,
    required: true,
  },
  name : {
    type : String,
    required: true,
  },
  avatar: {
    type: String,
  }
},{
timestamps: true
});

let storage = multer.diskStorage({
  destination: function (req, file, cb) { // this cb is callback function
    cb(null, path.join(__dirname , '..', AVATAR_PATH));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  }
});

// static function
userSchema.statics.uploadedAvatar = multer({storage : storage}).single('avatar');//this last thing says only one file is stored

userSchema.statics.avatarPath = AVATAR_PATH; // as we are going to use the avatar path for user model so to get that we are using this methode

const user = mongoose.model('User', userSchema);

module.exports = user ;