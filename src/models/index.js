const basadedatos = require('../secret/db');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    basadedatos.DB, 
    basadedatos.USER, 
    basadedatos.PASSWORD, 
    {
        host: basadedatos.HOST,
        dialect: basadedatos.DIALECT,
        pool: {
            max: basadedatos.pool.max,
            min: basadedatos.pool.min,
            acquire: basadedatos.pool.acquire,
            idle: basadedatos.pool.idle
        },
        logging: false,
    }
);


var modelos = {};

const Users = require('../models/Users.model')(sequelize, Sequelize);
const Videos = require('../models/Videos.model')(sequelize, Sequelize);
const Progress = require('../models/Progress.model')(sequelize, Sequelize);

modelos.usuarios = Users;
modelos.videos = Videos;
modelos.progreso = Progress;
modelos.sequelize = sequelize;
modelos.Sequelize = Sequelize;

module.exports = modelos;

// var modelos = [];

// modelos.push(sequelize);
// modelos.push(Sequelize);



// modelos.push(Users);

// module.exports = modelos;

/*Array  [ 
    { "key": "value", "key": "value" }, 
    { "key": "value", "key": "value" }, 
    { "key": "value", "key": "value" }, 
    { "key": "value", "key": "value" }, 
    { "key": "value", "key": "value" }, 
    { "key": "value", "key": "value" } 
    ]
*/
//List  [ nombre, apellido, segundoapellido ]
//Cluster  [ 2, nombre, %, 46, apellido ]
//JSON { "key": "value", "key": "value" }
