const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodoverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
//arreglar error handlebars en las consultas con moongose
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');


//iniciacion del server
const app = express();
require('./database');
require('./config/passport');
//settings 

app.set('port', process.env.PORT ||  3000)

app.set('views', path.join(__dirname, 'views'));

app.engine('.hbs', exphbs({
  handlebars: allowInsecurePrototypeAccess(Handlebars), // arreglar error handlebars en las consultas con moongose
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs'
}));

app.set('view engine', '.hbs');

//middlewares
app.use(express.urlencoded({extended: false}));
app.use(methodoverride('_method')); //permite enviar formularios y datos con inputs con metodo method 
app.use(session({
    secret: 'mysecretapp',
    resave: 'true',
    saveUninitialized: 'true'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//variables globales
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null; 
   next();
});

//rutas 
app.use(require ('./routes/index'));
app.use(require ('./routes/users'));
app.use(require ('./routes/notes'));

//static files
app.use(express.static(path.join(__dirname, 'public')));

//server listen
app.listen(app.get('port'), function(){
    console.log('Servidor iniciado en el puerto', app.get('port'));
});