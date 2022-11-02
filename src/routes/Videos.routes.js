const controlador = require('../controllers/Videos.controller');
const auth = require('../middlewares/auth.middleware');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});

const _cursoUploader = require('../uploaders/cursos');


module.exports = (app) => {
    app.get("/api/videos", auth, controlador.obetenerVideos);
    app.post("/api/videos/agregarVideo", auth, controlador.agregarVideo);
    app.get("/api/videos/area", auth, controlador.videosArea);

    // Admin
    app.post("/api/videos/agregarVideo", auth, controlador.agregarVideo);
    app.post('/videos/uploads', upload.single('video_subido'), controlador.uploadVideo);
    
    app.post('/api/videos/new/', _cursoUploader.single('video'), controlador.SaveCurso);
    
    app.put('/api/videos/modificarVideo/:id', auth, controlador.updateVideo);
    app.delete('/api/videos/eliminarVideo/:id', auth, controlador.eliminarVideo);
}