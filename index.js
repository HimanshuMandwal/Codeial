const express = require('express');
const app = express();
const port=8000;
const expressLayouts=require('express-ejs-layouts');

app.use(express.static('./assets'));
//for using layouts we need to require 'express-ejs-layouts' and write app.use(expressLayouts); just above the routes as the routes are going to use the views that uses this layout
app.use(expressLayouts);

//to extract the styles and script from sub pages to layout use this two lines
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);


//use express router for different routing
app.use('/',require('./routes/index'));//here we could write either ./routes only then also this search for the index.js inside it or either the way it is written './routes/index'
//any request comes in require the index of routes



//for setting up our view engine
app.set('view engine','ejs');
app.set('views','./views');








app.listen(port,function(err){
    if(err)
    {
    // console.log('there is a error in setting up the server',err);
    console.log(`error:${err}`);//using enterpolation(uses back ticks)

    }
    else{
        // console.log('server is running on the port :',port);
        console.log(`server is running on port :${port} `);
    }
});