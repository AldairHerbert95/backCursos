const { AccessDeniedError } = require('sequelize');
const jwt = require('jsonwebtoken');
const index = require('../models');
const videos = index.videos;

//const { usuarios } = require('../models');

var Funciones = {
    /**
     * @param datos Tiene que ser un array [ 'asdasd', 'asda45646sd', 64, xCosa ]
     */
    ValidarString: (datos) => {
        const _longitud = datos.length;
        var _validaciones = 0;
        for (let i = 0; i < _longitud; i++) {
            const element = datos[i];
            if(element !== undefined && element !== null && typeof(element) === 'string' && element !== ""){
                _validaciones++;
            }
        }
        if(_validaciones == _longitud){
            return true;
        }
        else return false;
    }
};


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
    const { rol } = req;

    const { name, duration, course, path } = req.body;

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

exports.updateNameVideo = async (req, res) => {
    //Middleware AUTH.js
    const { id, rol } = req;
    //Peticion
    const { new_name } = req.body;
    const idVideo = Number(req.params.id);
    if (rol === 'admin' && !isNaN(idVideo)) {
        const _video = await videos.findOne({ where: { id: idVideo } });
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
}

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