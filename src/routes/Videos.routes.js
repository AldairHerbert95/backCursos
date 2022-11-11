const controlador = require('../controllers/Videos.controller');
const auth = require('../middlewares/auth.middleware');
const myMulter = require('../uploaders/cursos');


module.exports = (app) => {
    app.get("/api/videos/area", auth, controlador.videosArea);
    app.get('/api/videos/play/:id', controlador.getVideo)

    // Admin
    app.post("/api/videos/agregarVideo", auth, controlador.agregarVideo);
    app.get("/api/videos", auth, controlador.obetenerVideos);
    app.post("/api/videos/agregarVideo", auth, controlador.agregarVideo);
    app.post('/api/videos/new/', controlador.SaveCurso);
    app.put('/api/videos/modificarVideo/:id', auth, controlador.updateVideo);
    app.delete('/api/videos/eliminarVideo/:id', auth, controlador.eliminarVideo);

    app.post('/videos/uploads', myMulter.single('video_subido'), controlador.uploadVideo);

}