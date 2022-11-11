const { Socket } = require('socket.io');
const db = require('../models');
const Videos = db.videos;

var Cluster = {
    VIDEOS_UPLOAD: []
};

/**
 * @param { base64, part, total, curso }  _data 
 */

exports.AddB64 = (_data) => {
    const _uploadcurrent = Cluster.VIDEOS_UPLOAD.filter(d => {return d.curso == _data.curso})[0];
    if(!_uploadcurrent){
        Cluster.VIDEOS_UPLOAD.push(_data)
        console.log( Cluster);
        
    }
    console.log(_uploadcurrent);
    console.log(Cluster);
    // if(_uploadcurrent) {
    //     _uploadcurrent.base64 = _data.base64;
    // }
}