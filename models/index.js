let path = require('path');
let app = require('../app')


// Cargar ORM
let Sequelize = require('sequelize');

//    DATABASE_URL = postgres://user:passwd@host:port/database
let logs = process.env.DEV === 'true' ? false : false
let sequelize;
let sequelizeSession;

sequelize = new Sequelize('postgres://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD + '@' + process.env.DB_HOST +':5432/' + process.env.POSTGRES_DB,{logging:logs});
// Importar la definicion de las tablas 
let Asignatura = sequelize.import(path.join(__dirname, 'Asignatura'));
let Persona = sequelize.import(path.join(__dirname, 'Persona'));
let Video = sequelize.import(path.join(__dirname, 'Video'));
let Comentario = sequelize.import(path.join(__dirname, 'Comentario'));
//Relacion 1 a N entre Asignatura y Video:
Asignatura.hasMany(Video)
Video.belongsTo(Asignatura)

//Relacion 1 a N entre Asignatura y Comentario
Asignatura.hasMany(Comentario)
Comentario.belongsTo(Asignatura)

//Relacion 1 a N entre Video y Comentario
Video.hasMany(Comentario)
Comentario.belongsTo(Video)

//Relacion 1 a N entre Persona y Comentario
Persona.hasMany(Comentario)
Comentario.belongsTo(Persona)

//sincronizamos la bbdd
sequelize.sync();

//Exportamos modelos

exports.Persona = Persona;   // exportar definición de tabla Persona
exports.Asignatura = Asignatura; // exportar definición de tabla Asignatura
exports.Video = Video; // exportar definición de tabla Video
exports.Comentario = Comentario; // exportar definición de tabla Comentario