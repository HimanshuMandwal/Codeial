module.exports.profile=function(req,res){
    return res.render('users',{
        title:'user/profile'
    });
}