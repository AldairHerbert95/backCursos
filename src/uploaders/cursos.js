const multer = require("multer");

function nameManipulate(nombre){
    //prueba.mp4
}


const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/pruebas');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

module.exports = multer({storage: diskStorage});