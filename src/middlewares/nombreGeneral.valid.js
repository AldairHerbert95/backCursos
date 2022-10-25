module.exports = (nombre) => {

    if(nombre !== undefined && nombre !== null && typeof(nombre) === 'string' && nombre !== ""){
        return true;
    }
    else return false;

};