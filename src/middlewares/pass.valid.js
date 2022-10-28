module.exports = (req, res, next) => 
{
    const { pass } = req.body;

    if(pass !== undefined && pass !== null && typeof(pass) === 'string'){
        next();
    }
    else res.status(500).end('NO SE PERMITE LA CONTRASEÑA');
};