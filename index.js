const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
//for authentication purepose
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-stretegy');
const passportJWT = require('./config/passport-jwt-stretegy');
const passportGoogle = require('./config/passport-google-oauth-2-stretegy');
const mongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMiddleware = require('./config/middleware');

/*      config for scss      */
app.use(sassMiddleware({
  src: './assets/scss', //here this ./ is mendatory without it does not work fine
  dest: './assets/css',
  debug: true, //this will be used to display the error while compiling the code
  outputStyle: 'expanded',
  prefix: '/css', // where the server looks for css file
}));

app.use(express.urlencoded());

app.use(cookieParser());//used for reading and writing into cookies we use this library and used it here as it has to be done in middleware section

app.use(express.static('./assets'));

// make the upload path available to browser
app.use('/uploads', express.static(__dirname +'/uploads'));
//for using layouts we need to require 'express-ejs-layouts' and write app.use(expressLayouts); just above the routes as the routes are going to use the views that uses this layout
app.use(expressLayouts);

//to extract the styles and script from sub pages to layouts <head> use this two lines
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);






//for setting up our view engine
app.set('view engine', 'ejs');
app.set('views', './views');

//mongo store is used to store the session cookie in db
app.use(session({
  name: "codeial",
  //TODO change the secrete before deployment in production mode
  secret: 'blahsomething', //for encoding we have to use a key that is here we used a dummy
  saveUninitialized: false, //this used if we dont have establised the initialization or loged in do we need to save the other things that are set by our we to be saved in cookie
  resave: false, // this is used if we have some presaved cookies and the cookies that is send by server matches that do we need to resave that
  cookie: {
    maxAge: (1000 * 60 * 100 * 10),// number in miliseconds age of the cookies
  },
  store: new mongoStore({ //this store is used to store the cookie permanently in db so that  whenever we restart the server we did not need to sign in again
    mongooseConnection: db,
    autoRemove: 'disabled',
  }
    , function (err) {
      console.log(err || ` connect-mongodb setup ok `)
    })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser); //middleware is called
app.use(flash());
app.use(customMiddleware.setFlash);


//use express router for different routing
app.use('/', require('./routes/index'));//here we could write either ./routes only then also this search for the index.js inside it or either the way it is written './routes/index'
//any request comes in require the index of routes


app.listen(port, function (err) {
  if (err) {
    console.log(`error:${err}`);//using enterpolation(uses back ticks)
  }
  else {
    console.log(`server is running on port :${port} `);
  }
});