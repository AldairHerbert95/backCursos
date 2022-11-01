const jwt = require('jsonwebtoken');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const { Op } = require('sequelize');
const index = require('../models');
const videos = index.videos;

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
    },

    ValidarArea: (area) => {
        if(area>=1 && area<=5 && !isNaN(area)){
            return true;
        }
        return false;
    }
};

exports.videosArea = async (req, res) => {
    const { area } = req;

    await videos.findAndCountAll({
        attributes: ['id', 'name', 'duration', 'course'],
        where: {areas: {[Op.contains]: [area]}    
        }
    }).then(data => {
        res.send(data);
    }).catch(err => {
        res.send(err);
    });

}

exports.consultarVideo = async (req, res) => {
    const { id } = req.params;

    if (!isNaN(id)) {
        const video = await videos.findByPk(id, {attributes: ['id', 'name', 'duration', 'course']});
        if (!video) {
            return res.status(404).end('No existe un video con ese id');
        }
        res.send(video);
    }
    else
    {
        return res.status(401).end('EL ID ES INCORRECTO');
    }
}

//Admin
exports.obetenerVideos = async (req, res) => {
    const { rol } = req;
    if(rol === 'admin'){
        const todos = await videos.findAll({attributes: ['id', 'name', 'duration', 'course']});
        res.send(todos);
    }
}

exports.agregarVideo = async (req, res) => {
    const { rol } = req;

    const { name, duration, course, area, path } = req.body;

    const _validText = Funciones.ValidarString([name, duration, course, path]);
    const _validArea = Funciones.ValidarArea(area);

    if (!_validText) {
        res.status(500).json("Uno o mas datos son invalidos");
    }
    else if (!_validArea) {
        res.status(500).json("El area no es valida");
    }
    else if (rol === 'admin') {
        const new_video = await videos.findOne({
            where: { name }
        });
        if (!new_video) {
            await videos.create({
                name,
                duration,
                course,
                areas,
                path
            }).then(data => {
                res.send(data);
            }).catch(err => {
                res.status(500);
                console.log(err);
            });
        } else {
            res.status(500).json("El nombre del video ya existe."); // true
        }
    } 
    else {
        res.status(401).json('NO AUTORIZADO');
    }
}

exports.updateVideo = async (req, res) => {
    //Middleware AUTH.js
    const { id, rol } = req;
    //Peticion
    const { new_name, new_course, new_path, new_area } = req.body;
    const _validText = Funciones.ValidarString([new_name, new_course, new_path]);
    const _validArea = Funciones.ValidarArea(new_area);
    const idVideo = Number(req.params.id);
    if (!_validText || !_) {
        res.status(500).json("Uno o mas datos Invalido");
    }
    else if (rol === 'admin' && !isNaN(idVideo)) {
        const _video = await videos.findOne({ where: { id: idVideo } });
        if (_video) {
            const videoName = await videos.findOne({where: {name: new_name}});
            if (!videoName || _video.name === new_name) {
                await videos.update({
                    name: new_name,
                    course: new_course,
                    area: new_area,
                    path: new_path,
                    idupdate: id
                }, { where: { id: _video.id } }).then(data => {
                    if (data != 0) {
                        res.status(200).json("Modificado Correctamente");
                    }
                    else {
                        res.status(500).json("No se pudo actualizar");
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
            return res.status(404).json({ message: 'Not found' });
        }
    }
    else {
        return res.status(401).json({ message: 'Invalid request' });
    }
}

exports.eliminarVideo = async (req, res) => {
    // Middleware AUTH.js
    const { rol } = req;
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