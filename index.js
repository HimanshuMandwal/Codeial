const express=require('express');
const app=express();
const port=8000;











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