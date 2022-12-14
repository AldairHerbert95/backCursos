module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define("usuarios", {
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
            type: Sequelize.INTEGER
        },
        token: {
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

    return Users;
};