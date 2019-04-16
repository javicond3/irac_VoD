let createError = require('http-errors');
let express = require('express');
const normalize = require('normalize-path');
let path = require('path');
let cookieParser = require('cookie-parser');
let partials = require('express-partials');
let morgan = require('morgan'); 
let funciones = require('./funciones')

//context path para la aplicacion en el servidor
let session = require('express-session');

const contextPath = normalize(process.env.CONTEXT);
exports.contextPath = contextPath;
const local = process.env.DEV;
exports.local = local;
//cas autentication
let CASAuthentication = require('cas-authentication');
// Create a new instance of CASAuthentication.
let service = process.env.SERVICE;
let cas_url = process.env.CAS;

let cas = new CASAuthentication({
  cas_url: cas_url,
  //local o despliegue
  service_url: service,
  cas_version: '3.0',
  session_info: 'user',
  destroy_session : true//me borra la sesión al hacer el logout
});



//instanciacion 
let app = express();
//rutas requeridas
let router = require('./routes/index')
let models = require('./models');
let Sequelize = require('sequelize');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//solo te imprime las peticiones incorrectas
app.use(morgan('combined', {
  skip: function (req, res) {return res.statusCode < 400 }
}))
app.use(partials());


//app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(contextPath, express.static(path.join(__dirname, 'public')));



app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));


// autologout
  //exit del cas el primero para que no entre en bucle. El cas es el encargado de eliminar la sesión
  app.get(path.join(contextPath, 'logout'), cas.logout);

  // Helper dinamico:
  app.use(cas.bounce, function (req, res, next) {
    // Hacer visible req.session en las vistas
    res.locals.session = req.session;
    //solo la primera vez
    if (!req.session.user.noFirst) {
      return models.Persona.findOrCreate(
        {where: {email: req.session.user.mail},
          defaults: { email: req.session.user.mail, nombre: req.session.user.cn, apellido: req.session.user.sn }
        }).then((user, created) => {
          return models.Persona.findOne({
            where: {
              email: req.session.user.mail
            }
          })
        })
        .then((pers) => {
          req.session.user.PersonaId = pers.identificador;         
          req.session.user.noFirst = true;
          req.session.user.nombre = funciones.primerasMayusc(pers.nombre);
          req.session.user.apellido = funciones.primerasMayusc(pers.apellido);
          //para que no haya problemas de que cosas no se han iniciado en la sesión
          req.session.save(function () {
            res.redirect(contextPath);
          })
        })
        .catch(function (error) {
          console.log("Error:", error);
          next(error);
        });
    }else{
      next();
    }
  });
  //router para contexto
  app.use(contextPath, router);


// catch 404 and forward to error handler
app.use(function (req, res, next) {

  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.DEV === 'true' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { 
    contextPath: contextPath,
    layout: false });
});

module.exports = app;
