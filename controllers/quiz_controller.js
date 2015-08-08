var models = require('../models/models.js');

/*
// GET /quizes/question
exports.question = function(req, res) {
  models.Quiz.findAll().success(function(quiz){
    res.render('quizes/question', {pregunta: quiz[0].pregunta})
  });
};

// GET /quizes/answer
exports.answer = function(req, res) {
  models.Quiz.findAll().success(function(quiz){
    if(req.query.respuesta === quiz[0].respuesta){
      res.render("quizes/answer", {respuesta: 'Correcto'});
    }else{
      res.render("quizes/answer", {respuesta: 'Incorrecto'});
    }
  });
};
*/

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req,res,next,quizId){
  models.Quiz.find(quizId).then(
    function(quiz){
      if(quiz){
        req.quiz = quiz;
        next();
      }else{
        next(new Error('No exite quizId='+quizId));
      }
    }
  ).catch(function(error){next(error)});
};

// Nueva versión
// GET /quizes
exports.index = function(req, res) {

  console.log('req.query.search => '+req.query.search);

  if(req.query.search){
    console.log('Dentro de buscar');
    var saneaBuscar = strtolower(trim(req.query.search));
    saneaBuscar = saneaBuscar.replace(' ','%');
    saneaBuscar = '%'+saneaBuscar+'%';

    // Búsqueda de preguntas
    models.Quiz.findAll({where:['pregunta like ?', saneaBuscar]})
    .then(
      function (quizes){
        res.render('quizes/index', {quizes:quizes, errors: []});
      }
    )
    .catch(function(error){next(error)});
  }else{
    // Listado de preguntas
    models.Quiz.findAll()
    .then(
      function (quizes){
        res.render('quizes/index', {quizes:quizes, errors: []});
      }
    )
    .catch(function(error){next(error)});
  }
};

// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', {quiz:req.quiz, errors: []});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';

  if(req.query.respuesta === req.quiz.respuesta){
    resultado = 'Correcto';
  }
  res.render('quizes/answer',{quiz:req.quiz,respuesta: resultado,errors: []});
};

// GET /quizes/new
exports.new = function (req, res) {
  var quiz = models.Quiz.build (// Crea el objeto quiz
    {pregunta: 'Pregunta', respuesta: 'Respuesta'}
  );
  res.render('quizes/new',{quiz:quiz, errors: []});
};

// POST /quizes/create
exports.create = function (req, res) {
  var quiz = models.Quiz.build (req.body.quiz);

  quiz
  .validate()
  .then(
    function(err){
      if(err){
        // console.log('Existe error');
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      }else{
        // console.log('Insercion en DB');
        // Guarda en DB los campos pregunta y respuesta de quiz
        quiz
        .save({fields: ["pregunta","respuesta","tema"]})
        .then(function(){res.redirect('/quizes')});
        // Redireccion al listado de preguntas
      }
    }
  );
};

// GET /quizes/:id/edit
exports.edit = function(req, res){
  var quiz = req.quiz; // Autoload de la pregunta recibida
  res.render('quizes/edit', {quiz:quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res){
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema = req.body.quiz.tema;

  req.quiz
  .validate()
  .then(
    function(err){
      if(err){
        console.log('Existe error');
        res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
      }else{
        console.log('Insercion en DB');
        // Guarda en DB los campos pregunta y respuesta de quiz
        req.quiz
        .save({fields: ["pregunta","respuesta","tema"]})
        .then(function(){res.redirect('/quizes')});
        // Redireccion al listado de preguntas
      }
    }
  );
};

// DELETE /quizes/:id
exports.destroy = function(req, res){
  req.quiz.destroy().then(function(){
    res.redirect('/quizes');
  }).catch(function(error){next(error)});
};
