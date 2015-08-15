// GET /login -- Formulario de login
exports.loginRequired = function(req,res,next){
  if (req.session.user){
    next();
  }else{
    res.redirect('/login');
  }
}

exports.new = function(req, res){
  var errors = req.session.errors || {};
  req.session.errors = {};

  res.render('sessions/new', {errors: errors});
};

// POST /login -- Crear session
exports.create = function(req, res){
  var login = req.body.login;
  var password = req.body.password;

  var userController = require('./user_controller');
  userController.autenticar(login, password, function(error, user){
    if(error){
      req.session.errors = [{'message':'Se ha producido un error: '+error}];
      res.redirect('/login');
      return;
    }

    // Crear req.session.user y guardar los campos id y username
    // La session se define por la existencia de: req.session.user

    // Marcar el tiempo de expiración de la sesion 20 minutos
    var sessionExpire = ((new Date()).getTime())+1200000;
    req.session.user = {id:user.id, username: user.username, expire: sessionExpire};
    res.redirect(req.session.redir.toString()); // redireccion a del path anterior a login

  });
};

// DELETE /logout  -- Destruir session
exports.destroy = function(req, res) {
  delete req.session.user;
  res.redirect(req.session.redir.toString());// redidreccion a path anterior a login
};
