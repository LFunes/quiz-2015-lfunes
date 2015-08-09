var path = require('path');

// Postgres DATABASE_URL = postgres://user:password@host:port/database
// SQLite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var port = (url[5]||null);
var host = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;

// Carga del modelo ORM
var Sequelize = require('sequelize');

// Usar DB SQLite o Postgres
var sequelize = new Sequelize(DB_name,user,pwd,
  {
    dialect: protocol,
    protocol: protocol,
    port: port,
    host: host,
    storage: storage,// solo SQLite (.env)
    omitNull: true // Solo Postgres
  }
);

// Importación de la definicion de la tabla Quiz
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

// Importación de definicion de la tabla Comment
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);

exports.Quiz = Quiz;// exportación de la definición de la tabla Quiz
exports.Comment = Comment;

/*
// sequelize.sync crea e inicializa la tabla de preguntas en DB
sequelize.sync().success(function(){
  // success() ejecuta el manejador una vez creada la tabla
  Quiz.count().success(function(count){
    if(count === 0){
        Quiz.create({
          pregunta: 'Capital de Italia',
          respuesta: 'Roma'
        })
        .success(function(){console.log('Base de datos inicializada')});
    }
  });
});
*/

// Nueva versión
// sequelize.sync crea e inicializa la tabla de preguntas en DB
sequelize.sync().then(function(){
  // then() ejecuta el manejador una vez creada la tabla
  Quiz.count().then(function(count){
    if(count === 0){
        Quiz.create({
          pregunta: 'Capital de Italia',
          respuesta: 'Roma',
          tema:'ocio'
        });
        Quiz.create({
          pregunta: 'Capital de Portugal',
          respuesta: 'Lisboa',
          tema:'ciencia'
        })
        .then(function(){console.log('Base de datos inicializada')});
    }
  });
});
