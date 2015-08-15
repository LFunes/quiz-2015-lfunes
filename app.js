var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Use partials
app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//tiempo de sesion
app.use(function(req, res, next) {

  var time = (new Date()).getTime();
  var sessionTransaction = time + 120000; // Tiempo en que debe expirar la sesion
  
  if(req.session.user){ // Solo en el caso de que exista sesion
    // Destruye la sesion del usuario pasados
    // 20minutos del login o +2minutos entre transacciones
    if(time > req.session.expire || time > req.session.user.expire){
      delete req.session.user; // Se destruye la sesion del usuario
    }else{
      // Nueva transaccion nuevo tiempo de exiración entre transacciones
      req.session.expire = sessionTransaction;
    }
  }
  next();
});

// helpers dinamicos
app.use(function(req, res, next){
  // Guardar path en session.redir para despues del login
  if(!req.path.match(/\/login|\/logout/)){
    req.session.redir = req.path;
  }

  // AcCeder en las vistas a req.session
  res.locals.session = req.session;
  next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
