const Users = require('./Users.model');
const Videos = require('./Videos.model');

module.exports = (sequelize, Sequelize) => {
    const x = sequelize.define("videos", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.TEXT
        },
        duration: {
            type: Sequelize.INTEGER
        },
        course: {
            type: Sequelize.TEXT
        },
        path: {
            type: Sequelize.TIME
        }
    }, {freezeTableName: true});
    return x;
};