let app = require('../app');
let models = require('../models');
let Sequelize = require('sequelize');
let funciones = require('../funciones')
let shell = require('shelljs');
const op = Sequelize.Op;

function getVideoIdentificador(identificador) {
    let video = {}
    return models.Video.findAll({
        where: {
            identificador: identificador
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
            [Sequelize.literal('"Comentarios"."identificador"'), 'ASC']
        ],
        raw: true
    })
        .each((respuesta) => {
            if (!video.identificador) {
                video.identificador = respuesta.identificador
                video.titulo = respuesta.titulo
                video.duracion = respuesta.duracion
                video.resumen = respuesta.resumen
                video.urlImagen = respuesta.urlImagen
                video.urlVideo = respuesta.urlVideo
                if (video.urlVideo) video.urlVideo.split('.').slice(0, -1).join('.')+".mpd"
                video.likes = respuesta.likes
                video.dislikes = respuesta.dislikes
                video.comentarios = []
            }
            if (respuesta['Comentarios.identificador']) {
                let c = {}
                c.identificador = respuesta['Comentarios.identificador']
                c.texto = respuesta['Comentarios.texto']
                c.nombre = funciones.primerasMayusc(respuesta['Comentarios.Persona.nombre']) + " " + funciones.primerasMayusc(respuesta['Comentarios.Persona.apellido'])
                c.likes = respuesta['Comentarios.likes']
                c.dislikes = respuesta['Comentarios.dislikes']
                c.fecha = respuesta['Comentarios.fecha']
                video.comentarios.push(c)
            }
            
        })
        .then(() => {
            return video
        })
}

exports.getVideo = function (req, res, next) {
    return getVideoIdentificador(req.params.video)
        .then((vid) => {
            res.render('video',
                {
                    contextPath: app.contextPath,
                    video: vid,
                    formPath: "" + req.baseUrl + "/video/" + vid.identificador + "/comentario"
                });
        }).catch(function (error) {
            console.log("Error:", error);
            next(error);
        });
}

exports.convertVideo = function (req, res, next) {
    shell.exec('./VideoDisplay/generadorDeVideos/script.sh ./public/videos/'+req.body.titulo+".mp4", function (code, stdout, stderr) {
        if(code)console.log('Exit code:', code);
        if(stdout)console.log('Program output:', stdout);
        if(stderr)console.log('Program stderr:', stderr);
        let video = {};
        video.likes = 0;
        video.dislikes = 0;
        video.titulo = req.body.titulo;
        video.duracion = 0;
        video.resumen = req.body.resumen;
        video["urlImagen"] = req.body.titulo+".jpg";
        video["urlVideo"] = req.body.titulo+".mp4";
        video["AsignaturaCodigo"] = req.params.asignatura;
        let videoToAnadir = models.Video.build(
            video
        )
        return videoToAnadir.save()
            .catch(function (error) {
                console.log("Error:", error);
            });
    });
    res.redirect(app.contextPath + "/" + req.params.asignatura + "?subir=Si")
}
