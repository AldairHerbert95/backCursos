const jwt = require('jsonwebtoken');
const CryptoJS = require("crypto-js");
const key = require('../secret/crypto');
const index = require('../models');
const progreso = index.progreso;

exports.agregarProgreso = async (req, res) => {
    const { id, rol } = req;

    const { videoId, progress } = req.body;

    // Decrypt
    const bytes  = CryptoJS.AES.decrypt(progress, key.cryptoKey);
    const decoded = bytes.toString(CryptoJS.enc.Utf8);

    if (rol === 'alumno') {
        const new_progress = await progreso.findOne({
            where: { id_usuario: id, id_video: videoId }
        });

        if (!new_progress) {
            await progreso.create({
                id_usuario: id,
                id_video: videoId,
                progreso: decoded
            }).then(data => {
                res.status(200).json('Registrado correctamente');
            }).catch(err => {
                res.status(500);
                console.log(err);
            });
            if (decoded == 100) {
                await progreso.update({
                    done: true
                },{where: {id_usuario: id, id_video: videoId}});
            }
        }
        else {
            await progreso.update({
                progreso: decoded
            }, {
                where:
                    { id_usuario: id, id_video: videoId }
            }).then(data => {
                res.status(200).json('Actualizado Correctamente');
            }).catch(err => {
                res.status(500);
                console.log(err);
            })
            if (decoded == 100) {
                await progreso.update({
                    done: true
                },{where: {id_usuario: id, id_video: videoId}});
            }
        }
    } else {
        res.status(401).end('NO AUTORIZADO');
    }
}