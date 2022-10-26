const controlador = require('../controllers/Users.controller');
const auth = require('../middlewares/auth.middleware');

module.exports = (app) => {
    app.get("/api/obtenerUsuario", controlador.obtenerUsuario);
    // app.get("/api/consultarUsuarios/:id",  controlador.consultarUsuario);
    app.post("/api/agregarUsuario", controlador.agregarUsuario);
    app.put("/api/actualizarNombre/", controlador.actualizarNombre);
    app.put("/api/actualizarPass/", controlador.actualizarPass);
    app.delete("/api/eliminarUsuario/", controlador.eliminarUsuario);
    app.post("/api/login/",controlador.login)

    //Admin
    app.get("/api/obtenerUsuarios",  controlador.consultar );
    app.put("/api/actualizarNombre/:id", controlador.actualizarNombreId);
    app.put("/api/actualizarPass/:id", controlador.actualizarPassId);
    app.put("/api/actualizarArea/:id", controlador.actualizarArea);
    app.put("/api/actualizarRol/:id", controlador.actualizarRol);
    app.delete("/api/eliminarUsuarioId/:id", auth, controlador.eliminarUsuarioId);

};