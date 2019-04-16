let app = require('../app');
let models = require('../models');
let Sequelize = require('sequelize');
let funciones = require('../funciones')
const op = Sequelize.Op;



exports.setComentario = function (req, res, next) {
    let comentario = {};
    comentario.likes = 0;
    comentario.dislikes = 0;
    comentario.texto = req.body.texto;
    comentario.fecha = new Date();
    comentario["AsignaturaCodigo"] = req.params.asignatura;
    comentario["PersonaIdentificador"] = req.session.user.PersonaId;
    comentario["VideoIdentificador"] = req.params.video
    
    let comentarioToAnadir = models.Comentario.build(
        comentario
    )
    return comentarioToAnadir.save()
    .then(() =>{
        next();
    })
    .catch(function (error) {
            console.log("Error:", error);
            next(error);
        });
}