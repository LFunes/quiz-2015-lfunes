var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz LF', errors: []});
});

/* Version REST
router.get('/quizes/question',quizController.question);
router.get('/quizes/answer',quizController.answer);
*/

// Autoload de comandos :quizId
router.param('quizId', quizController.load); // Autoload :quizId
router.param('commentId', commentController.load); // Autoload :commentId

// Definicion de rutas de sessionController
router.get('/login', sessionController.new);// Formulario de logueo
router.post('/login', sessionController.create);// Crear sessionController
router.get('/logout', sessionController.destroy);// Cerrar sesion

// Version Modelo
// Definición de rutas de /quizes
router.get('/quizes',quizController.index);
router.get('/quizes/:quizId(\\d+)',quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',quizController.answer);

// Rutas controladas por sesion
router.get('/quizes/new',sessionController.loginRequired,quizController.new);
router.post('/quizes/create',sessionController.loginRequired,quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',sessionController.loginRequired,quizController.edit);
router.put('/quizes/:quizId(\\d+)',sessionController.loginRequired,quizController.update);
router.delete('/quizes/:quizId(\\d+)',sessionController.loginRequired,quizController.destroy);

// Comentarios
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',
					sessionController.loginRequired, commentController.publish);

// Autor
router.get('/author', function(req, res){
  res.render('author',{errors: []});
});


module.exports = router;
