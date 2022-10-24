module.exports = (sequelize, Sequelize) => {
    const x = sequelize.define("usuarios", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        usuario: {
            type: Sequelize.TEXT
        },
        contraseña: {
            type: Sequelize.TEXT
        },
        rol: {
            type: Sequelize.TEXT
        },        
        area: {
            type: Sequelize.TEXT
        },
        token: {
            type: Sequelize.TEXT
        },
        createdAt: {
            type: Sequelize.TIME
        },
        updatedAt: {
            type: Sequelize.TIME
        }
    }, {freezeTableName: true});
    return x;
};