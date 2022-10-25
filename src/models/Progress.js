const Users = require('./Users.model');
const VideosModel = require('./Videos.model');
const Videos = require('./Videos.model');

module.exports = (sequelize, Sequelize) => {
    const Progress = sequelize.define("progreso", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        userId: {
            type: Sequelize.INTEGER,
            references: {
                model: Users,
                key: 'id'
            }
        },
        videoId: {
            type: Sequelize.INTEGER,
            references: {
                model: Videos,
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

    Users.belongsToMany(Videos, { through: Progress });
    Videos.belongsToMany(Users, { through: Progress });
    return Progress;
};

