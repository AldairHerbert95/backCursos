const controlador = require('../controllers/Users.controller');
const auth = require('../middlewares/auth.middleware');
const validName = require('../middlewares/usuario.validar');


module.exports = (app) => {
    // app.get("/api/consultarUsuarios/:id",  controlador.consultarUsuario);
    app.get("/api/obtenerUsuario", controlador.obtenerUsuario);
    app.post("/api/agregarUsuario", controlador.agregarUsuario);
    app.put("/api/actualizarNombre/", auth, validName, controlador.actualizarNombre);
    app.put("/api/actualizarPass/", controlador.actualizarPass);
    app.delete("/api/eliminarUsuario/", controlador.eliminarUsuario);
    
    // LOG IN
    app.post("/api/login/",controlador.login)

    //Admin
    app.get("/api/obtenerUsuarios",  controlador.consultar );
    app.delete("/api/eliminarUsuarioId/:id", auth, controlador.eliminarUsuarioId);
    app.put('/api/editarUsuario/:id', auth, validName, controlador.editarUsuario);

};