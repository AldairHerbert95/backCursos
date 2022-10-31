const controlador = require('../controllers/Users.controller');
const auth = require('../middlewares/auth.middleware');
const validName = require('../middlewares/usuario.validar');


module.exports = (app) => {
    // All users
    app.get("/api/obtenerUsuario", auth, controlador.obtenerUsuario);
    app.put("/api/actualizarUsuario/", auth, validName, controlador.actualizarUsuario);
    
    // LOG IN
    app.post("/api/login/",controlador.login);

    //Admin
    app.post("/api/agregarUsuario", auth, validName, controlador.agregarUsuario);
    app.get("/api/obtenerUsuarios", auth, controlador.consultar );
    app.delete("/api/eliminarUsuarioId/:id", auth, controlador.eliminarUsuarioId);
    app.put('/api/editarUsuario/:id', auth, validName, controlador.editarUsuario);

};