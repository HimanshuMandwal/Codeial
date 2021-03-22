module.exports.setFlash = function(req, res, next) { //this middleware is just to put the flash message to sent as the locals in response
  res.locals.flash = {
    "success": req.flash('success'),
    "error": req.flash('error')
  }
  next();
}