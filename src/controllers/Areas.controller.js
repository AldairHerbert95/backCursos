const index = require('../models/');
const areas = index.areas;

exports.agregarArea = async (req, res) => {
    const { rol } = req;

    const { nuevo_nombre } = req.body;

    if (rol === 'admin') {
        const new_area = await areas.findOne({
            where: { area: nuevo_nombre }
        });
        if (!new_area) {
            await areas.create({
                area: nuevo_nombre
            }).then(data => {
                res.send(data);
            }).catch(err => {
                res.status(500);
                console.log(err);
            });
        } else {
            res.status(500).json("El nombre del area ya existe."); // true
        }
    }
    else {
        res.status(401).json('NO AUTORIZADO');
    }
}