module.exports = (sequelize, Sequelize) => {
    const Areas = sequelize.define("areas", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        area: {
            type: Sequelize.TEXT
        },
        createdAt: {
            type: Sequelize.TIME
        },
        updatedAt: {
            type: Sequelize.TIME
        },
        idupdate: {
            type: Sequelize.INTEGER
        }
    }, {freezeTableName: true});

    return Areas;
};