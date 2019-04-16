let app = require('../app');
let models = require('../models');
let Sequelize = require('sequelize');
let funciones = require('../funciones')
const op = Sequelize.Op;


exports.getAll = function () {
return models.Asignatura.findAll({
    raw: true
}).then(function (asignaturas) {
    return asignaturas;
})
}

function getAsignaturaCodigo (codigo){
    let asignatura = {}
    return models.Asignatura.findAll({
        where: {
            codigo: codigo
        },
        include: [{
            //incluye los videos.
            model: models.Video,
            //left join
            required: false
        }],
        raw: true
    })
        .each((respuesta) => {
            if(!asignatura.codigo){
                asignatura.codigo = respuesta.codigo
                asignatura.videos = []
                asignatura.comentarios = []
            }
            if(respuesta['Videos.identificador']){
                let v = {}
                v.identificador = respuesta['Videos.identificador']
                v.titulo = respuesta['Videos.titulo']
                v.likes = respuesta['Videos.likes']
                v.dislikes = respuesta['Videos.dislikes']
                v.urlImagen = respuesta['Videos.urlImagen']
                asignatura.videos.push(v)
            }
        })
        .then(()=>{
            return models.Asignatura.findAll({
                where: {
                    codigo: codigo
                },
                include: [{
                    //incluye los comentarios.
                    model: models.Comentario,
                    //left join
                    required: false,
                    include: [{
                        //incluye la persona que hizo el comentario.
                        model: models.Persona,
                        //left join
                        required: false
                    }]
                }],
                order: [
                [Sequelize.literal('"Comentarios"."identificador"'), 'DESC']
                ],
                raw: true
            })
        }).each((respuesta) => {
            if (respuesta['Comentarios.identificador']) {
                let c = {}
                c.identificador = respuesta['Comentarios.identificador']
                c.texto = respuesta['Comentarios.texto']
                c.nombre = funciones.primerasMayusc(respuesta['Comentarios.Persona.nombre']) + " " + funciones.primerasMayusc(respuesta['Comentarios.Persona.apellido'])
                c.likes = respuesta['Comentarios.likes']
                c.dislikes = respuesta['Comentarios.dislikes']
                c.fecha = respuesta['Comentarios.fecha']
                asignatura.comentarios.push(c)
            }
        })
        .then(()=>{
            console.log(asignatura)
            return asignatura
        })
}
exports.getAsignatura

exports.getAsignatura = function(req,res,next){
    return getAsignaturaCodigo(req.params.asignatura)
    .then((asign) =>{
        res.render('asignatura',
            {
                contextPath: app.contextPath,
                asignatura: asign,
                formPath: "" + req.baseUrl + "/" + asign.codigo + "/comentario"
            });
        }).catch(function (error) {
            console.log("Error:", error);
            next(error);
        });
}