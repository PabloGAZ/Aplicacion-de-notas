const express = require('express');
const router = express.Router();

const User = require('../models/User');
const passport = require('passport');


router.get('/users/login', function(req, res){
    res.render('users/login');
});

router.post('/users/login', passport.authenticate('local',{
    successRedirect: '/notes',
    failureRedirect: '/users/login',
    failureFlash: true
}));

router.get('/users/register', function(req, res){
    res.render('users/register');
});

router.post('/users/register', async function(req, res){
    const {name, email, password, confirmpassword} = req.body;
    const errors = [];
    console.log(req.body);
    if(password != confirmpassword){
    errors.push({text: 'Las contraseñas no coinciden'});
    }
    if(password.length<4){
        errors.push({text: 'La contraseña debe ser mayor a 4 carácteres'});
    }
    if(errors.length>0){
        res.render('users/register', {errors, name, email, password, confirmpassword});
    }else{
    const emailUser = await User.findOne({email: email});
    if (emailUser){
        req.flash('error_msg', 'Email en uso');
        res.redirect('/users/register');
    }else{
    const newUser = new User({name, email, password})
    newUser.password = await newUser.encryptPassword(password);
   await newUser.save();
    req.flash('success_msg', 'Registro completado');
    res.redirect('/users/login');
}
    }
    
});

router.get('/users/logout', function(req, res){
    req.logout();
    res.redirect('/')
});

module.exports = router;