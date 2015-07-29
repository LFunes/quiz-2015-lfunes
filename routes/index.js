var express = require('express');
var router = express.Router();
var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz LF' });
});

/* Version REST
router.get('/quizes/question',quizController.question);
router.get('/quizes/answer',quizController.answer);
*/

// Autoload de comandos :quizId
router.param('quizId', quizController.load); // Autoload :quizId

// Version Modelo
// Definición de rutas de /quizes
router.get('/quizes',quizController.index);
router.get('/quizes/:quizId(\\d+)',quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',quizController.answer);

// Autor
router.get('/author', function(req, res){
  res.render('author');
});


module.exports = router;
