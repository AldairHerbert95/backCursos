const { AccessDeniedError } = require('sequelize');
const idGeneralValid = require('../middlewares/idGeneral.valid');
const index = require('../models')
const videos = index.videos;

const idValid = require('../middlewares/idGeneral.valid');
const nameValid = require('../middlewares/nombreGeneral.valid');




exports.obetenerVideos = async (req, res) => {
    const todos = await videos.findAll();
    res.send(todos);
}

exports.consultarVideo = async (req, res) => {
    const { id } = req.params;

    const _valid = idValid(id);
    if(_valid==false){
        return res.status(401).end('EL ID ES INCORRECTO');
    }
    
    const video = await videos.findByPk(id);
    if(!video){
        return res.status(404).end('No existe un video con ese id');
    }
    res.send(video);
}

exports.agregarVideo = async (req, res) => {
    const { name, duration, course, path } = req.body;

    const _validName = nameValid(videos);

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
}