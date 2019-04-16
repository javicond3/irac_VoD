let express = require('express');
let app = require('../app')
let router = express.Router();
let Sequelize = require('sequelize');
let models = require('../models');
let asignaturaController = require('../controllers/asignatura_controller')
let comentarioController = require('../controllers/comentario_controller')
let videoController = require('../controllers/video_controller')

router.all('*', function(req,res,next){
  res.locals.asignaturaPath = "" + req.baseUrl
  res.locals.videoPath = "" + req.baseUrl +"/video"
  return asignaturaController.getAll()
  .then((asignaturas) => {
    res.locals.asignaturas = asignaturas
    next();
  })
    .catch(function (error) {
      console.log('error: ' + error.message);
      next(error);
    });
})
router.get('/', function (req, res) {
  res.render('index',
    {
      contextPath: app.contextPath
    });
});
router.get('/:asignatura', asignaturaController.getAsignatura)
router.get('/video/:video', videoController.getVideo)
router.post('/:asignatura/comentario', comentarioController.setComentario, function(req,res){
  res.redirect(res.locals.asignaturaPath + "/" + req.params.asignatura)
})
router.post('/video/:video/comentario', comentarioController.setComentario, function (req, res) {
  res.redirect(res.locals.videoPath + "/" + req.params.video)
})


module.exports = router;


