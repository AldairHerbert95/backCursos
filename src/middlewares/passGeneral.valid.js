module.exports = (pass) => {

    if(pass !== undefined && pass !== null && typeof(pass) === 'string' && pass !== ""){
        return true;
    }
    else return false;
}