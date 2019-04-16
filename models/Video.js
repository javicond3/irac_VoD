// Definicion del modelo Video:

module.exports = function (sequelize, DataTypes) {
    let Video = sequelize.define('Video',
        {
            identificador: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            titulo: {
                type: DataTypes.STRING 
            },
            duracion: {
                type: DataTypes.STRING
            },
            resumen: {
                type: DataTypes.TEXT
            },
            urlImagen : {
                type: DataTypes.STRING
            },
            urlVideo: {
                type: DataTypes.STRING
            },
            likes: {
                type: DataTypes.INTEGER,
                default: 0
            },
            dislikes: {
                type: DataTypes.INTEGER,
                default: 0
            }
            },
        {
            timestamps: false
        });
    Video.removeAttribute('id');
    return Video;
};
