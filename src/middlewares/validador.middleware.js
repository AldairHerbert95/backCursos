module.exports = (text) => {

    if(text !== undefined && text !== null && typeof(text) === 'string' && text !== ""){
        return true;
    }
    else return false;

};