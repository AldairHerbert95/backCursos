const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const index = require('../models');

const usuarios = index.usuarios; 
const llave = require("../secret/jwt");

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

    ValidarPass: (pass) => {
        if(pass !== undefined && pass !== null && typeof(pass) === 'string' && pass !== ""){
            return true;
        }
        else return false;
    }
};

// exports.consultarUsuario = async (req, res) => {
//     const { id } = req.params;

//     const _valid = idValid(id);
//     if(_valid==false){
//         return res.status(401).end('EL ID ES INCORRECTO');
//     }

//     const usuario = await usuarios.findByPk(id);
//     if(!usuario){
//         return res.status(404).end('No existe un usuario con ese id');
//     }
//     res.send(usuario);
// }

exports.obtenerUsuario = async (req, res) => {
    const token = req.headers['x-access-token'];

    if(!token){
        return res.status(401).json({message: 'Sin token'});
    }
    else
    {
        var decoded = jwt.decode(token);
        try{
            const user = {
                id: decoded.id,
                usuario: decoded.usuario,
                rol: decoded.rol,
                area: decoded.area
            }
            return res.json(user);
        }
        catch{
            return res.status(500).json({message: 'Token malformado'});
        }
    }
}

exports.agregarUsuario = async(req, res) => {
    const { usuario, pass, rol, area } = req.body;

    const _validText = Funciones.ValidarString([usuario, rol, area]);
    const _validPass = Funciones.ValidarPass(pass);
    
    if(!_validText || !_validPass){
        if(_validText==false){
            return res.status(401).end('LOS DATOS NO SON VALIDOS');
        }
        else if(_validPass==false){
            return res.status(401).end('NO SE PERMITE LA CONTRASEÑA');
        }
    }

    const nombre_usuario = await usuarios.findOne({  //Busca si ya existe un nombre de usuario en la base de datos
        where: { usuario } });
    if (nombre_usuario === null) {
        const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(pass, salt, function(err, hash) {
            // Store hash in your password DB.
            usuarios.create({
                usuario, 
                contraseña: hash, 
                rol, 
                area
            }).then(data => {
                res.send(data);
            }).catch(err => {
                res.status(500);
                console.log(err);
            });
            
        });
    });
    } else {
    res.status(500).end("El nombre de usuario ya existe."); // true
    }
}

exports.actualizarNombre = async (req, res) => {
    const { id } = req;
    const { nuevo_nombre } = req.body;

        const user = await usuarios.findByPk(id);
        
        if(!user){
            return res.status(404).end('No existe el usuario');
        }

        const registro = await usuarios.findOne({where: {usuario: nuevo_nombre}});

        if (registro === null) {
            await usuarios.update({
                usuario: nuevo_nombre
            }, {where: {id}}).then(data => {
                if(data == 1){
                    res.status(200).end('EL NOMBRE SE HA ACTUALIZADO! :)');
                }
                else{
                    res.send('NO SE ACTUALIZÓ');
                }
            }).catch(err => {
                res.status(500);
                console.log(err);
            });
        } 
        else {
            res.status(500).end('El nombre de usuario ya existe');
        }
}

exports.actualizarPass = async (req, res) => {
    const { pass_actual, nueva_pass } = req.body;

    token = req.headers['x-access-token'];
    var decoded = jwt.decode(token);

    try {
        const userId = decoded.id;
    
        const usuario = await usuarios.findByPk(userId);
        if(!usuario){
            return res.status(404).end('No existe el usuario');
        }
    
        const _validPass = Funciones.ValidarPass(pass_actual);
        if(_validPass==false){
            return res.status(401).end('NO SE PERMITE LA CONTRASEÑA');
        }

        const _validPass2 = Funciones.ValidarPass(nueva_pass);
        if(_validPass2==false){
            return res.status(401).end('NO SE PERMITE LA CONTRASEÑA');
        }
    
        const saltRounds = 10;
        const pass = usuario.pass;
        bcrypt.compare(pass_actual, pass, function(err, result) {  // Compara la pass ingresada, con la guardada
            // Si la pass coincide...
            if (result) {
                bcrypt.genSalt(saltRounds, function(err, salt) {
                    bcrypt.hash(nueva_pass, salt, function(err, hash) {
                        // Se guarda la nueva pass.
                        usuarios.update({
                            pass: hash
                         }, {where: {id: userId}}).then(data => {
                            if(data == 1){
                                res.status(200).end('CONTRASEÑA ACTUALIZADA CORRECTAMENTE');
                            }
                            else{
                                res.send('NO SE ACTUALIZÓ LA CONTRASEÑA');
                            }
                         }).catch(err => {
                            res.status(500);
                            console.log(err);
                        });
                    });
                });
            }
            // Si la pass no coincide
            else {
                return res.status(500).end("LA CONTRASEÑA NO COINCIDE");
            }
          });
    } 
    catch {
        return res.status(500).json({message: 'Token malformado'});
    }
}

exports.eliminarUsuario = async (req, res) => {
    token = req.headers['x-access-token'];
    var decoded = jwt.decode(token);

    try {
        const userId = decoded.id;
    
        const usuario = await usuarios.findByPk(userId);
        if(!usuario){
            return res.status(404).end('NO EXISTE EL USUARIO');
        }
    
        await usuarios.destroy({
            where: {id: userId}
        });
        return res.status(200).end('USUARIO ELIMINADO');
    } 
    catch {
        return res.status(500).json({message: 'Token malformado'});    
    }
}


// LOG IN
exports.login = async (req, res) => {
    const { nombre_usuario, pass} = req.body;

    const _validPass = Funciones.ValidarPass(pass);
    if(_validPass==false){
        return res.status(401).end('NO SE PERMITE LA CONTRASEÑA');
    }

    const _validUsuario = Funciones.ValidarString([nombre_usuario]);
    if(_validUsuario==false){
        return res.status(401).end('NO SE PERMITE LE USUARIO');
    }

    const usuario = await usuarios.findOne({  
        where: { usuario: nombre_usuario } });
    
    if(!usuario){
        res.status(404).end('No existe el nombre de usuario');
    }
    else{
        if(nombre_usuario === usuario.usuario){

            const saltRounds = 10;
            bcrypt.compare(pass, usuario.contraseña, function(err, result) {  // Compara la pass ingresada, con la guardada
                // Si la pass coincide...
                if (result) {
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        bcrypt.hash(pass, salt, function(err, hash) {
                            // Se guarda la nueva pass.        
                            const payload = {
                                id: usuario.id,
                                usuario: usuario.usuario,
                                rol: usuario.rol,
                                area: usuario.area
                              };
                            const token =jwt.sign(payload, llave.key,{
                                expiresIn:"2h"
                            });
                            res.json({
                                message: "Autenticacion Exitosa!",
                                token: token
                            });
                            usuarios.update({
                                token: token
                            }, {where: {usuario: nombre_usuario}})
    
                        });
                    });
                }
                // Si la pass no coincide
                else {
                    return res.status(500).end("CONTRASEÑA INCORRECTA!");
                   
                }
              });
        }
    }
}


//Admin

exports.consultar = async (req, res) => {
    const token = req.headers['x-access-token'];

    if(!token){
        return res.status(401).json({message: 'Sin token'});
    }
    else
    {
        var decoded = jwt.decode(token);
        try{
            const rol = decoded.rol;
            if(rol === "admin"){
                const todos = await usuarios.findAll({attributes: ['id', 'usuario', 'rol', 'area', 'createdAt', 'updatedAt']});
                res.send(todos)
            }
        }
        catch{
            return res.status(500).json({message: 'Token malformado'});
        }
    }
}

exports.eliminarUsuarioId = async (req, res) => {
    const { id, rol } = req;

    const idUsuario = Number(req.params.id);
        if(rol === 'admin' && !isNaN(idUsuario)){
            const usuario = await usuarios.findOne({ where: {id: idUsuario}});
            if(!usuario){
                return res.status(404).json({message: 'NO EXISTE EL USUARIO'});
            }
            await usuarios.destroy({
            where: {id: idUsuario}
            });
            return res.status(200).json({message:'USUARIO ELIMINADO'});
        }
        else{
            return res.status(401).json({message: 'NO AUTORIZADO'})
        }
}

exports.editarUsuario = async(req, res) => {
    const { id, rol} = req;

    const { nuevo_nombre, nuevo_pass, nuevo_rol, nueva_area } = req.body;

    const _validPass = Funciones.ValidarPass(nuevo_pass);
    const _validText = Funciones.ValidarString([nuevo_rol, nueva_area]);

    const idUsuario = Number(req.params.id);
    if(rol === 'admin' && !isNaN(idUsuario)){
        if(!_validPass || !_validText){
            if(_validText == false){
                return res.status(401).json({message: 'DATOS INVALIDOS'});
            }
            else if(_validPass == false){
                return res.status(401).json({message:'NO SE PERMITE LA CONTRASEÑA'});
            }
        }

        const userId = await usuarios.findByPk(idUsuario);
        if(!userId){
            return res.status(404).end('No existe el id');
        }
        const nombre_usuario = await usuarios.findOne({  //Busca si ya existe un nombre de usuario en la base de datos
            where: { usuario: nuevo_nombre} });
        if (nombre_usuario === null) {
            const saltRounds = 10;
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(nuevo_pass, salt, function(err, hash) {
                // Store hash in your password DB.
                usuarios.update({
                    usuario: nuevo_nombre, 
                    contraseña: hash, 
                    rol: nuevo_rol, 
                    area: nueva_area,
                    idupdate: id
                }, {where: {id: idUsuario}}).then(data => {
                    if (data == 1) {
                        res.status(200).json('Datos Actualizados');
                    } else {
                        res.send('No se actualizo');
                    }
                }).catch(err => {
                    res.status(500);
                    console.log(err);
                });          
            });
        });
        } else {
        res.status(500).json({message:"El nombre de usuario ya existe."}); // true
        }
    }
    else{
        return res.status(401).json({ message: 'Invalid request' });
    }
}