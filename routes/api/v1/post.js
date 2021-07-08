const express = require('express');
const router = express.Router();
const postApi = require('../../../controllers/api/v1/post_apis');
const passport = require('passport');

router.get('/',postApi.index);
router.delete('/:id' ,passport.authenticate('jwt',{session:false}), postApi.destroy);

module.exports = router;