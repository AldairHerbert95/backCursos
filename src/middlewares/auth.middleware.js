const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
    try
    {
        const _token = req.headers['x-access-token'];
        const _decoded = jwt.decode(_token);
        //_decoded = payload
        /**
         * id
         * usuario
         * rol
         * area
         */
        req.id = _decoded.id;
        req.usuario = _decoded.usuario;
        req.rol = _decoded.rol;
        req.area = _decoded.area;
        next();
    }
    catch
    {
        return res.status(500).json({message: 'Invalid token'});
    }




};