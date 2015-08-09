var models = require('../models/models.js');

// GET /quizes/:quizId(\\d+)/comments/new
exports.new = function (req, res) {
  res.render('comments/new.ejs', {quizId: req.params.quizId, errors: []});
};

// POST /quizes/:quizId(\\d+)/comments
exports.create = function(req, res){
  var comment = models.Comment.build(
    {texto: req.body.comment.texto,
      QuizId: req.params.QuizId
    });

    comment
    .validate()
    .then(
      function(err){
        if(err){
          res.render('comments/new.ejs',
          {comment:comment, quizId: req.params.quizId, errors: err.errors});
        }else{
          comment // save: guarda en DB el campo texto de comment
          .save()
          .then(function(){ res.redirect('/quizes/'+req.params.quizId)});
          // Redireccion al listado de preguntas
        }
      }
    ).catch(function(error){next(error)});
};
