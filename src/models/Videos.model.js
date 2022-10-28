module.exports = (sequelize, Sequelize) => {
    const Videos = sequelize.define("videos", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.TEXT
        },
        duration: {
            type: Sequelize.TEXT
        },
        course: {
            type: Sequelize.TEXT
        },
        path: {
            type: Sequelize.TEXT
        },
        idupdate: {
            type: Sequelize.INTEGER
        }
    }, {freezeTableName: true});

    return Videos;
};