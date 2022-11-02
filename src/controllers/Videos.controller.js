const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');
const index = require('../models');
const videos = index.videos;
const areasdb = index.areas;

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

    ValidarAreas: async (arrayAreas) => {
        const _longitud = arrayAreas.length;        
        const _areas = await areasdb.findAll({attributes: ['id']});

        var _validaciones = 0;
        for (let i = 0; i < arrayAreas.length; i++) {
            const element = arrayAreas[i];
            var existElement = _areas.filter(el => {
                return el.id === element
            });
            if(existElement.length != 0 && !isNaN(element) && element !== null){
                _validaciones++;
            }
        }
        if (_validaciones == _longitud) {
            return true;
        }
        else return false;
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

    const { name, duration, course, areas, path } = req.body;

    const _validText = Funciones.ValidarString([name, duration, course, path]);

    const _validAreas = await Funciones.ValidarAreas(areas);
    if (!_validText) {
        res.status(500).json("Uno o mas datos son invalidos");
    }
    else if (!_validAreas) {
        res.status(500).json("Valor de Areas no es valido");
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
    const { new_name, new_course, new_path, new_areas } = req.body;
    const _validText = Funciones.ValidarString([new_name, new_course, new_path]);
    const _validAreas = await Funciones.ValidarAreas(new_areas);
    const idVideo = Number(req.params.id);
    if (!_validText || !_validAreas) {
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
                    areas: new_areas,
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

exports.uploadVideo = async (req, res) => {

    const file = req.file;
    const body = req.body;

    // const storage = multer.diskStorage({
    //     destination: function (req, file, cb){
    //         cb(null, '/prueba')
    //     },
    //     filename: function(req, file, cb){

    //     }
    // })

    console.log(file, body);
}


exports.SaveCurso = (req, res) => {
    const _filename = req.file.originalname;
    const ruta = path.join(__dirname, '../../', 'uploads', 'pruebas', _filename);

    if(fs.existsSync(ruta)){
        return res.sendStatus(200);
    }
    else return res.sendStatus(500);
    
};