const controlador = require('../controllers/streamPrueba.controller');

module.exports = (app) => {
    app.get("/api/video", controlador.video );
}