const controlador = require('../controllers/Videos.controller');
const auth = require('../middlewares/auth.middleware');

module.exports = (app) => {
    app.get("/api/videos", controlador.obetenerVideos);
    app.get("/api/videos/:id", controlador.consultarVideo);

    // Admin
    app.post("/api/videos/agregarVideo", controlador.agregarVideo);
    app.put('/api/videos/modificarNombre/:id', auth, controlador.updateNameVideo);
    app.put('/api/videos/modificarCurso/:id', auth, controlador.modificarCurso);
    app.delete('/api/videos/eliminarVideo/:id', auth, controlador.eliminarVideo);
}