const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const index = require('../models');

const usuarios = index.usuarios; 
const usuarioValid = require('../middlewares/usuarioGeneral.valid');
const passValid = require('../middlewares/passGeneral.valid');
const areaValid = require('../middlewares/areaGeneral.valid');
const rolValid = require('../middlewares/rolGeneral.valid');
const idValid = require('../middlewares/idGeneral.valid');
const llave = require("../secret/jwt");



exports.consultar = async (req, res) => {
    const todos = await usuarios.findAll();
    res.send(todos);
}

exports.consultarUsuario = async (req, res) => {
    const { id } = req.params;

    const _valid = idValid(id);
    if(_valid==false){
        return res.status(401).end('EL ID ES INCORRECTO');
    }

    const usuario = await usuarios.findByPk(id);
    if(!usuario){
        return res.status(404).end('No existe');
    }
    res.send(usuario);
}

exports.agregar = async(req, res) => {
    const { usuario, pass, rol, area } = req.body;
    const _validName = usuarioValid(usuario);
    const _validPass = passValid(pass);
    const _validRol = rolValid(rol);
    const _validArea = areaValid(area);
    


    if(!_validName || !_validPass || !_validRol || !_validArea){
        if(_validName==false){
            return res.status(401).end('NO SE PERMITE EL NOMBRE DE USUARIO');
        }
        else if(_validPass==false){
            return res.status(401).end('NO SE PERMITE LA CONTRASEÑA');
        }
        else if(_validRol==false){
            return res.status(401).end('NO SE PERMITE EL ROL');
        }
        else if(_validArea==false){
            return res.status(401).end('NO SE PERMITE EL AREA');
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
                pass: hash, 
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
    const { nuevo_nombre } = req.body;
    token = req.headers['x-acces-token'];
    var decoded = jwt.decode(token);

    const userId = decoded.id;

    const usuario = await usuarios.findByPk(userId);
    if(!usuario){
        return res.status(404).end('No existe el usuario');
    }

    const _valid = usuarioValid(nuevo_nombre);
    if(_valid==false){
        return res.status(401).end('NO SE PERMITE EL NOMBRE DE USUARIO');
    }

    await usuarios.update({
        usuario: nuevo_nombre
    }, {where: {id: userId}}).then(data => {
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

exports.actualizarPass = async (req, res) => {
    const { pass_actual, nueva_pass } = req.body;

    token = req.headers['x-acces-token'];
    var decoded = jwt.decode(token);

    const userId = decoded.id;

    const usuario = await usuarios.findByPk(userId);
    if(!usuario){
        return res.status(404).end('No existe el usuario');
    }

    const _validPass = passValid(pass_actual);
    if(_validPass==false){
        return res.status(401).end('NO SE PERMITE LA CONTRASEÑA');
    }

    const _validPass2 = passValid(nueva_pass);
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

exports.eliminarUsuario = async (req, res) => {
    token = req.headers['x-acces-token'];
    var decoded = jwt.decode(token);

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

exports.login = async (req, res) => {
    const { nombre_usuario, pass} = req.body;

    const _validPass = passValid(pass);
    if(_validPass==false){
        return res.status(401).end('NO SE PERMITE LA CONTRASEÑA');
    }

    const _validUsuario = passValid(nombre_usuario);
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
            bcrypt.compare(pass, usuario.pass, function(err, result) {  // Compara la pass ingresada, con la guardada
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

exports.actualizarNombreId = async (req, res) => {
    const { nuevo_nombre } = req.body;
    const { id } = req.params;

    const _valid = idValid(id);
    if(_valid==false){
        return res.status(500).end('EL ID ES INCORRECTO');
    }
   
    token = req.headers['x-acces-token'];
    var decoded = jwt.decode(token);

    const rol = decoded.rol;

    if(rol === 'admin'){
        const usuario = await usuarios.findByPk(id);
        if(!usuario){
            return res.status(404).end('No existe el usuario');
        }
        const _valid = usuarioValid(nuevo_nombre);
        if(_valid==false){
            return res.status(401).end('NO SE PERMITE EL NOMBRE DE USUARIO');
        }
        await usuarios.update({
            usuario: nuevo_nombre},
            {where: {id: id}}).then(data => {
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
        return res.status(401).end("NO AUTURIZADO");
    }
}

exports.actualizarPassId = async (req, res) => {
    const { pass_actual, nueva_pass } = req.body;
    const { id } = req.params;

    token = req.headers['x-acces-token'];
    var decoded = jwt.decode(token);

    const rol = decoded.rol;

    if(rol === 'admin'){
        const usuario = await usuarios.findByPk(id);
        if(!usuario){
            return res.status(404).end('No existe el usuario');
        }

        const _validPass = passValid(pass_actual);
        if(_validPass==false){
            return res.status(401).end('NO SE PERMITE LA CONTRASEÑA');
        }

        const _validPass2 = passValid(nueva_pass);
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
                        }, {where: {id}}).then(data => {
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
    else{
        return res.status(401).end("NO AUTORIZADO");
    }
}

exports.actualizarRol = async (req, res) => {
    const { nuevo_rol } = req.body;
    const { id } = req.params;

    const _valid = idValid(id);
    if(_valid==false){
        return res.status(500).end('EL ID ES INCORRECTO');
    }
   
    token = req.headers['x-acces-token'];
    var decoded = jwt.decode(token);

    const rol = decoded.rol;

    if(rol === 'admin'){
        const usuario = await usuarios.findByPk(id);
        if(!usuario){
            return res.status(404).end('No existe el usuario');
        }

         const _valid = rolValid(nuevo_rol);
         if(_valid==false){
             return res.status(401).end('NO SE PERMITE EL ROL');
         }

        await usuarios.update({
                 rol: nuevo_rol
            }, {where: {id}}).then(data => {
                 if(data == 1){
                     res.status(200).end('ROL ACTUALIZADO! :)');
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
        return res.status(401).end("NO AUTURIZADO");
    }
}

exports.actualizarArea = async (req, res) => {
    const { nueva_area } = req.body;
    const { id } = req.params;

    const _valid = idValid(id);
    if(_valid==false){
        return res.status(500).end('EL ID ES INCORRECTO');
    }
   
    token = req.headers['x-acces-token'];
    var decoded = jwt.decode(token);

    const rol = decoded.rol;

    if(rol === 'admin'){
        const usuario = await usuarios.findByPk(id);
        if(!usuario){
            return res.status(404).end('NO EXISTE EL USUARIO');
        }
        const _valid = areaValid(nueva_area);
        if(_valid==false){
            return res.status(401).end('NO SE PERMITE EL AREA');
        }
        await usuarios.update({
            area: nueva_area},
            {where: {id}}).then(data => {
            if(data == 1){
                res.status(200).end('SE ACTUALIZÓ EL AREA! :)');
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
        return res.status(401).end("NO AUTURIZADO");
    }
}

exports.eliminarUsuarioId = async (req, res) => {

    const { id } = req.params;

    token = req.headers['x-acces-token'];
    var decoded = jwt.decode(token);

    const rol = decoded.rol;
    if(rol === 'admin'){

        const usuario = await usuarios.findByPk(id);
        if(!usuario){
            return res.status(404).end('NO EXISTE EL USUARIO');
        }

        await usuarios.destroy({
        where: {id: id}
        });
        return res.status(200).end('USUARIO ELIMINADO');
    }
    else{
        return res.status(401).end('NO AUTORIZADO')
    }
}