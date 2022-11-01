const controlador = require('../controllers/Areas.controller');
const auth = require('../middlewares/auth.middleware');
const validName = require('../middlewares/usuario.validar');


module.exports = (app) => {
    app.post('/api/agregarArea', auth, validName, controlador.agregarArea);

}