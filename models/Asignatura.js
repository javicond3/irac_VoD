// Definicion del modelo Asignatura:

module.exports = function (sequelize, DataTypes) {
    let Asignatura = sequelize.define('Asignatura',
        {
            codigo: {
                primaryKey: true,
                type: DataTypes.STRING,
                validate: { notEmpty: { msg: "Falta código" } }
            },

            nombre: {
                type: DataTypes.STRING,
                validate: { notEmpty: { msg: "Falta nombre asignatura español" } }
            },
            acronimo: {
                type: DataTypes.STRING(5)
            },
            curso: {
                type: DataTypes.NUMERIC(),
                validate: { notEmpty: { msg: "Falta curso" } }
            },
            semestre: {
                type: DataTypes.ENUM('1S', '2S', '1S-2S', 'A', 'I'),
                validate: { notEmpty: { msg: "Falta semestre" } }
            },
            tipo: {
                type: DataTypes.ENUM('bas', 'obl', 'opt', 'obl-itn', 'opt-itn'), //duda
                validate: { notEmpty: { msg: "Falta tipo" } }
            },
            creditos: {
                type: DataTypes.NUMERIC,
                validate: { notEmpty: { msg: "Falta créditos" } }
            },
        },
        {
            timestamps: false
        });
    Asignatura.removeAttribute('id');
    return Asignatura;
};

/*
COPY (SELECT distinct on (a.codigo) a.codigo, a.nombre, a.acronimo, a.curso, a.semestre, a.tipo, a.creditos
  FROM public."Asignaturas" as a order by a.codigo) TO '/tmp/asignaturas.csv' DELIMITER ';' CSV HEADER;
*/
/*
copy public."Asignaturas"(
        codigo,nombre,acronimo,curso,semestre,tipo,creditos)
    from '/tmp/asignaturas.csv' DELIMITER ';' CSV HEADER;
*/
