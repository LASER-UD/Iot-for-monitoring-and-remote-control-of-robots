require('dotenv').config({ path: 'ENV_FILENAME' });
const express = require('express');
const path = require('path'); //paquete para arreglar las rutas estaticas

const logger = require('morgan'); //logger es igual a morgan
const exphbs = require('express-handlebars');


const passport = require('passport');
const session = require('express-session');


//-- Inicializacion
const db = require('./database');
var app = express();

require('./config/passport') //Se trae el archivo con la autenticacion de usuarios (este trae modelo base de datos de usuario)

var server = require('http').Server(app);

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


app.use(session({ // Manejo del servidor de las cookies
  secret: '3gsb2os82bwsk', // string para serializar/deserializar las cookies
  resave: true,
  saveUninitialized: true,
}));
app.use(passport.initialize()); //Arranca passport configura cookies
app.use(passport.session()); //Ejecuta proceso de lectura/escritura de cookie } --//

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

//Global variables (Middleware propio)
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

//-- Routes ---
app.use(require('./routes/users.routes'));
app.use(require('./routes/aplicacion.routes'));
// catch 404 and forward to error handler


//---- Static Files--------

app.use(express.static(path.join(__dirname, 'public'))); // Envia rutas publicas



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

module.exports = { app: app, server: server };
