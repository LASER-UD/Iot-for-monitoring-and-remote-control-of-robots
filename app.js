var createError = require('http-errors');
var express = require('express');
var path = require('path');//paquete para arreglar las rutas estaticas
var cookieParser = require('cookie-parser');
var logger = require('morgan');//logger es igual a morgan
const exphbs=require('express-handlebars');


var indexRouter = require('./routes/index');
var loginRouter = require("./routes/login");//crea la variable y la vincula con el archivo

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({ // Se genera un nuevo motor de plantillas
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),//carpeta layouts
    partialsDir: path.join(app.get('views'), 'partials'),// carpeta partils
    extname: '.hbs'
}));
app.set('view engine', '.hbs'); // Se selecciona motor de plantillas

// Middlewars

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/* Protección de conexion HTTP
function auth(req, res, next){//Proteccion de Htttp
  var authHeader = req.headers.authorization;
  if(!authHeader){
    var err = new Error('You shall not pass!');
    res.setHeader('WWW-Authenticate','Basic');
    err.status = 401;
    next(err);
    return;
  }

  var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
  var user = auth[0];
  var pass = auth[1];

  if(user == 'mecanico' && pass == '1234mercury'){
    next();
  } else {
    var err = new Error('You shall not pass!');
    res.setHeader('WWW-Authenticate','Basic');
    err.status = 401;
    next(err);
  }

}

app.use(auth);*/

//---- Static Files--------

app.use(express.static(path.join(__dirname, 'public'))); // Envia rutas publicas

//-- Routes ---


app.use('/', indexRouter);
app.use('/login', loginRouter);//Crea la ruta

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
