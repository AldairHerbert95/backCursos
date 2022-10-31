module.exports = (sequelize, Sequelize) => {
    const Progress = sequelize.define("progreso", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_usuario: {
            type: Sequelize.INTEGER
        },
        id_video: {
            type: Sequelize.INTEGER
        },
        progreso: {
            type: Sequelize.DOUBLE
        },
        done: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        createdAt: {
            type: Sequelize.TIME
        },
        updatedAt: {
            type: Sequelize.TIME
        }
    }, {freezeTableName: true});
    return Progress;
};

