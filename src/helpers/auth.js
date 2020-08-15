const helpers = {};

helpers.isAuthenticated=function(req, res , next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error_msg', 'Debes estar logueado para acceder aquí' );
    res.redirect('/users/login');
};

module.exports=helpers;