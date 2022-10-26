const { AccessDeniedError } = require('sequelize');
const jwt = require('jsonwebtoken')
const index = require('../models');
const videos = index.videos;

const idGeneralValid = require('../middlewares/idGeneral.valid');
const nameValid = require('../middlewares/nombreGeneral.valid');
const textValid = require('../middlewares/validador.middleware');
const idValid = require('../middlewares/idGeneral.valid');
const { usuarios } = require('../models');




exports.obetenerVideos = async (req, res) => {
    const todos = await videos.findAll({attributes: ['id', 'name', 'duration', 'course']});
    res.send(todos);
}

exports.consultarVideo = async (req, res) => {
    const { id } = req.params;

    const _valid = idValid(id);
    if (_valid == false) {
        return res.status(401).end('EL ID ES INCORRECTO');
    }

    const video = await videos.findByPk(id, {attributes: ['id', 'name', 'duration', 'course']});
    if (!video) {
        return res.status(404).end('No existe un video con ese id');
    }
    res.send(video);
}

//Admin
exports.agregarVideo = async (req, res) => {
    const { name, duration, course, path } = req.body;

    const _validName = nameValid(videos);

    token = req.headers['x-access-token'];
    var decoded = jwt.decode(token);

    console.log(decoded);
    try {
        const rol = decoded.rol;

        if (rol === 'admin') {
            const new_video = await videos.findOne({
                where: { name }
            });
            if (new_video === null) {
                await videos.create({
                    name,
                    duration,
                    course,
                    path
                }).then(data => {
                    res.send(data);
                }).catch(err => {
                    res.status(500);
                    console.log(err);
                });
            } else {
                res.status(500).end("El nombre del video ya existe."); // true
            }
        } else {
            res.status(401).end('NO AUTORIZADO');
        }
    }
    catch {
        return res.status(500).json({ message: 'Token malformado' });
    }
}

exports.updateNameVideo = async (req, res) => {
    //Middleware AUTH.js
    const { id, usuario, rol, area } = req;
    //Peticion
    const { new_name } = req.body;
    const idVideo = Number(req.params.id);
    console.log(idVideo);
    if (rol === 'admin' && !isNaN(idVideo)) {
        const _video = await videos.findByPk({ where: { id: idVideo } });
        if (_video) {
            const videoName = await videos.findOne({where: {name: new_name}});
            if (videoName === null) {
                await videos.update({
                    name: new_name,
                    idupdate: id
                }, { where: { id: _video.id } }).then(data => {
                    if (data != 0) {
                        res.sendStatus(200);
                    }
                    else {
                        res.sendStatus(500);
                    }
                }).catch(err => {
                    res.status(500).json({ message: 'Internal error' });
                });
            }
            else {
                res.status(500).end('El nombre del video ya existe');
            }
        }
        else {
            return res.status(404).json({ message: 'No found' });
        }
    }
    else {
        return res.status(401).json({ message: 'Invalid request' });
    }
};

exports.modificarCurso = async (req, res) => {
     //Middleware AUTH.js
     const { id, rol } = req;
     //Peticion
     const { new_course } = req.body;
     const idVideo = Number(req.params.id);
     if (rol === 'admin' && !isNaN(idVideo)) {
         const _video = await videos.findOne({ where: { id: idVideo } });
         if (_video) {
                 await videos.update({
                     course: new_course,
                     idupdate: id
                 }, { where: { id: _video.id } }).then(data => {
                     if (data != 0) {
                         res.sendStatus(200);
                     }
                     else {
                         res.sendStatus(500);
                     }
                 }).catch(err => {
                     res.status(500).json({ message: 'Internal error' });
                 });
         }
         else {
             return res.status(404).json({ message: 'Not found' });
         }
     }
     else {
         return res.status(401).json({ message: 'Invalid request' });
     }
}

exports.eliminarVideo = async (req, res) => {
    // Middleware AUTH.js
    const { id, rol } = req;
    // Peticion
    const idVideo = Number(req.params.id);
    if (rol === 'admin' && !isNaN(idVideo)) {
        const _video = await videos.findOne({ where: {id: idVideo}});
        if (_video) {
            await videos.destroy({
                where: {id: idVideo}
            });
            return res.status(200).end("Video Eliminado")
        } else {
            return res.status(404).json({message: 'No existe el video'})
        }
    } 
    else {
        return res.status(401).json({message: 'Invalid request'})
    }
} 