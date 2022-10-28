const controlador = require('../controllers/Progress.controller');
const auth = require('../middlewares/auth.middleware');

module.exports = (app) => {
    app.post('/api/progreso', auth, controlador.agregarProgreso);

}