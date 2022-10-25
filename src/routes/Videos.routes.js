const controlador = require('../controllers/Videos.controller');

module.exports = (app) => {
    app.get("/api/videos", controlador.obetenerVideos)
    app.get("/api/videos/:id", controlador.consultarVideo)
    app.post("/api/agregarVideo", controlador.agregarVideo);
}