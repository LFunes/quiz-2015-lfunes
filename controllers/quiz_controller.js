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
        next(new Error('No exite quizId='+quizId););
      }
    }
  ).catch(function(error){next(error);});
};

// Nueva versión
// GET /quizes
exports.index = function(req, res) {
  models.Quiz.findAll().then(
    function (quizes){
      res.render('quizes/index', {quizes:quizes});
    }
  ).catch(function(error){next(error);});
};

// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', {quiz:req.quiz});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';

  if(req.query.respuesta === req.quiz.respuesta){
    resultado = 'Correcto';
  }
  res.render("quizes/answer",{quiz:req.quiz,respuesta: resultado});
};
