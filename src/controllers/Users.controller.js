const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const index = require('../models');
const llave = require("../secret/jwt");

const usuarios = index.usuarios;

const SaltHash = bcrypt.genSaltSync(10); //variable para los saltos del bcrypt

var Funciones = {
    /**
     * @param datos Tiene que ser un array [ 'asdasd', 'asda45646sd', 64, xCosa ]
     */
    ValidarString: (datos) => {
        const _longitud = datos.length;
        var _validaciones = 0;
        for (let i = 0; i < _longitud; i++) {
            const element = datos[i];
            if (element !== undefined && element !== null && typeof (element) === 'string' && element !== "") {
                _validaciones++;
            }
        }
        if (_validaciones == _longitud) {
            return true;
        }
        else return false;
    },

    ValidarPass: (pass) => {

        if (pass !== undefined && pass !== null && typeof (pass) === 'string' && pass !== "") {
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

exports.obtenerUsuario = async (req, res) => {

    const {id, usuario, rol, area} = req;
    const datos = {
        id, usuario, rol, area
    }
    res.send(datos);
}

exports.actualizarUsuario = async (req, res) => {
    const { id, usuario } = req;
    const { nuevo_nombre, pass_actual, nueva_pass } = req.body;

    const _validPass = Funciones.ValidarPass(nueva_pass);

    if (!_validPass) {
        return res.status(401).end('NO SE PERMITE LA CONTRASEÑA');
    }

    const nombre = await usuarios.findOne({
        where: { usuario: nuevo_nombre }
    });
    const user = await usuarios.findByPk(id);

    if (!nombre || nombre.usuario == usuario) {

        const _valid = bcrypt.compareSync(pass_actual, user.contraseña); //compara la contraseña ingresada con la guardada en la bd
        // Si la pass coincide...
        if (_valid) {
            const hashedPass = bcrypt.hashSync(nueva_pass, SaltHash);
            // Se guarda la nueva pass.
            usuarios.update({
                usuario: nuevo_nombre,
                contraseña: hashedPass
            }, { where: { id } }).then(data => {
                if (data == 1) {
                    res.status(200).json('DATOS ACTUALIZADOS CORRECTAMENTE');
                }
                else {
                    return res.status(500).json("NO SE ACTUALIZARON LOS DATOS");
                }
            }).catch(err => {
                res.status(500);
                console.log(err);
            });
        }
        // Si la pass no coincide
        else {
            return res.status(500).json("LA CONTRASEÑA NO COINCIDE");
        }
    }
    else {
        return res.status(401).json("El nombre de usuario ya existe");
    }
}


// LOG IN
exports.login = async (req, res) => {
    const { nombre_usuario, pass } = req.body;

    const usuario = await usuarios.findOne({
        where: { usuario: nombre_usuario }
    });

    if (!usuario) {
        res.status(404).end('No existe el nombre de usuario');
    }
    else {
        if (nombre_usuario === usuario.usuario) {
            const _valid = bcrypt.compareSync(pass, usuario.contraseña);
            if (_valid) {
                const payload = {
                    id: usuario.id,
                    usuario: usuario.usuario,
                    rol: usuario.rol,
                    area: usuario.area
                };
                const token = jwt.sign(payload, llave.key, {
                    expiresIn: "2h"
                });
                res.json({
                    message: "Autenticacion Exitosa!",
                    token: token
                });
                usuarios.update({
                    token: token
                }, { where: { usuario: nombre_usuario } });

            }
            else {
                return res.status(500).json({ message: "CONTRASEÑA INCORRECTA!" });
            }
        }
        else {
            return res.status(401).json('Nombre de usuario o contraseña incorrectos');
        }
    }
}


//Admin

exports.agregarUsuario = async (req, res) => {
    const { id, rol } = req;
    const { nuevo_nombre, pass, rolUsuario, area } = req.body;

    const _validText = Funciones.ValidarString([rolUsuario]);
    const _validPass = Funciones.ValidarPass(pass);
    const _validArea = Funciones.ValidarArea(area);

    if (!_validText || !_validPass || !_validArea) {
        if (_validText == false) {
            return res.status(401).end('LOS DATOS NO SON VALIDOS');
        }
        else if(_validArea == false){
            return res.status(401).end('Area no valida');
        }
        else {
            return res.status(401).end('NO SE PERMITE LA CONTRASEÑA');
        }
    }

    if (rol === 'admin') {
        const user = await usuarios.findOne({  //Busca si ya existe un nombre de usuario en la base de datos
            where: { usuario: nuevo_nombre }
        });
        if (!user) {
            const hashedPass = bcrypt.hashSync(pass, SaltHash);
            // Store hash in your password DB.
            usuarios.create({
                usuario: nuevo_nombre,
                contraseña: hashedPass,
                rol: rolUsuario,
                area,
                idupdate: id
            }).then(data => {
                res.send(data);
            }).catch(err => {
                res.status(500);
                console.log(err);
            });
        } else {
            res.status(500).end("El nombre de usuario ya existe."); // true
        }
    }
    else {
        return res.status(401).json("No autorizado")
    }

}

exports.consultar = async (req, res) => {
    const { rol } = req;
    if (rol === "admin") {
        const todos = await usuarios.findAll({ attributes: ['id', 'usuario', 'rol', 'area', 'createdAt', 'updatedAt'] });
        res.send(todos);
    }
}

exports.eliminarUsuarioId = async (req, res) => {
    const { rol } = req;

    const idUsuario = Number(req.params.id);
    if (rol === 'admin' && !isNaN(idUsuario)) {
        const usuario = await usuarios.findOne({ where: { id: idUsuario } });
        if (!usuario) {
            return res.status(404).json({ message: 'NO EXISTE EL USUARIO' });
        }
        await usuarios.destroy({
            where: { id: idUsuario }
        });
        return res.status(200).json({ message: 'USUARIO ELIMINADO' });
    }
    else {
        return res.status(401).json({ message: 'NO AUTORIZADO' })
    }
}

exports.editarUsuario = async (req, res) => {
    const { id, rol, usuario } = req;

    const { nuevo_nombre, nuevo_pass, nuevo_rol, nueva_area } = req.body;

    const _validPass = Funciones.ValidarPass(nuevo_pass);
    const _validText = Funciones.ValidarString([nuevo_rol]);
    const _validArea = Funciones.ValidarArea(nueva_area);

    const idUsuario = Number(req.params.id);
    if (rol === 'admin' && !isNaN(idUsuario)) {
        if (!_validPass || !_validText || !_validArea) {
            if (_validText == false) {
                return res.status(401).json({ message: 'DATOS INVALIDOS' });
            }
            else if (_validArea == false) {
                return res.status(401).json("Area No permitida");
            }
            else {
                return res.status(401).json({ message: 'NO SE PERMITE LA CONTRASEÑA' });
            }
        }
        const userId = await usuarios.findByPk(idUsuario);
        if (!userId) {
            return res.status(404).json('No existe el id');
        }
        const user = await usuarios.findOne({  //Busca si ya existe un nombre de usuario en la base de datos
            where: { usuario: nuevo_nombre }
        });
        if (!user || usuario === nuevo_nombre) {
            const hashedPass = bcrypt.hashSync(nuevo_pass, SaltHash);
            // Store hash in your password DB.
            usuarios.update({
                usuario: nuevo_nombre,
                contraseña: hashedPass,
                rol: nuevo_rol,
                area: nueva_area,
                idupdate: id
            }, { where: { id: idUsuario } }).then(data => {
                if (data == 1) {
                    res.status(200).json('Datos Actualizados');
                } else {
                    res.send('No se actualizo');
                }
            }).catch(err => {
                res.status(500);
                console.log(err);
            });
        } else {
            res.status(500).json({ message: "El nombre de usuario ya existe." }); // true
        }
    }
    else {
        return res.status(401).json({ message: 'Invalid request' });
    }
}