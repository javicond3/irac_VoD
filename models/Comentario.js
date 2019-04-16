// Definicion del modelo Comentario:

module.exports = function (sequelize, DataTypes) {
    let Comentario = sequelize.define('Comentario',
        {
            identificador: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            texto: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            likes: {
                type: DataTypes.INTEGER,
                default:0
            },
            dislikes: {
                type: DataTypes.INTEGER,
                default:0
            },
            fecha:{
                type: DataTypes.DATEONLY
            }
        },
        {
            timestamps: false
        });
    Comentario.removeAttribute('id');
    return Comentario;
};