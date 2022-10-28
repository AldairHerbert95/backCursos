const { AccessDeniedError } = require('sequelize');
const jwt = require('jsonwebtoken');
const { videos } = require('../models');
const index = require('../models');
const progreso = index.progreso;

exports.agregarProgreso = async (req, res) => {
    const { id, rol } = req;

    const { videoId, progress, done } = req.body;

        if (rol === 'alumno') {
            console.log(id);
            console.log(videoId);
            const new_progress = await progreso.findOne({
                where: { id_usuario: id, id_video: videoId  }
            });
            if (new_progress === null) {
                await progreso.create({
                    id_usuario: id,
                    id_video: videoId,
                    progreso: progress,
                    done: done
                }).then(data => {
                    res.send(data);
                }).catch(err => {
                    res.status(500);
                    console.log(err);
                });
            } else {
                await progreso.update({
                    progreso: progress,
                    done: done
                }, {where: 
                    {id_usuario: id, id_video: videoId}
                }).then(data => {
                    res.send(data).json('Actualizado Correctamente');
                }).catch(err => {
                    res.status(500);
                    console.log(err);
                })
            }
        } else {
            res.status(401).end('NO AUTORIZADO');
        }
}