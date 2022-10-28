const UsersModel = require('./Users.model');
const VideosModel = require('./Videos.model');

module.exports = (sequelize, Sequelize) => {
    const Progress = sequelize.define("progreso", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_usuario: {
            type: Sequelize.INTEGER,
            references: {
                model: UsersModel,
                key: 'id'
            }
        },
        id_video: {
            type: Sequelize.INTEGER,
            references: {
                model: VideosModel,
                key: 'id'
            }
        },
        progreso: {
            type: Sequelize.DOUBLE
        },
        done: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    }, {freezeTableName: true});

    // UsersModel.belongsToMany(VideosModel, { through: Progress });
    // VideosModel.belongsToMany(UsersModel, { through: Progress });

    return Progress;
};

