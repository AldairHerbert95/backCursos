const fs = require('fs');
const path = require('path');
const { Connection } = require('pg');


// exports.video = async (req, res) => {
//     const videoRange = req.headers.range;    //Posicion del video en la que estamos
//     const videoPath = path.join(__dirname, "../videos", "prueba.mp4");   //ruta del video

//     const videoStat = fs.statSync(videoPath);   //Extrae informacion del archivo
//     const videoSize = videoStat.size;  //Tamaño del archivo

//     const chunkSize =  1 * 1e+6;        //Cantidad de datos que se enviara por chunk(fragmento)  -- 1MB por Chunk
//     const start = Number(videoRange.replace(/\D/g, ""));     
//     const end = start + Math.min(start + chunkSize, videoSize -1);

//     const contentLenght = end - start + 1;      //Tamaño del contenido

//     const headers = {
//         "Content-Range": `bytes ${start}-${end}/${videoSize}`,
//         "Accept-Ranges": "bytes",
//         "Content-Lenght": contentLenght,
//         "Content-Type": "video/mp4"
//     }
//     res.writeHead(206, headers);        //206 - Se envian datos por partes

//     const stream = fs.createReadStream(videoPath, { start, end })       //Lee el archivo, desde el inici
//     stream.pipe(res);
// }

exports.video = async (req, res) => {
    const videoPath = path.join(__dirname, "../videos", "prueba.mp4");      //ruta del video
    const videoStat = fs.statSync(videoPath);       //Extrae informacion del archivo
    const videoSize = videoStat.size;            //Tamaño del archivo
    const videoRange = req.headers.range;       //Posicion del video en la que estamos

    if (videoRange) {
        const parts = videoRange.replace(/bytes=/, "").split("-");      //
        const start = parseInt(parts[0], 10);                           //
        const end = parts[1]                                            //  Calcula donde empieza y donde termina el video
            ? parseInt(parts[1], 10)                                    //
            : videoSize - 1;                                             //
        const chunkSize = (end - start) + 1;                            //
        const file = fs.createReadStream(videoPath, { start, end });    //

        const header = {
            'Content-Range': `bytes ${start}-${end}/${videoSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4',
        };

        res.writeHead(206, header);
        file.pipe(res);
        
    } else {
        const head = {
            'Content-Length': videoSize,
            'Content-Type': 'video/mp4',
        };

        res.writeHead(200, head);
        fs.createReadStream(videoPath).pipe(res);

    }
}