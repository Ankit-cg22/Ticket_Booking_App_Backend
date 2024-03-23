function ObjtoString(data){
    let str =  ""

    for (let key in data) {
        str += key + ':' + data[key] + '|' ;
    }

    while(str.length < 100) str += '$'
    // we make sure that the string we are storing length exactly 100

    return str
}

function StringToObj(str){
    let pairs = str.split('|');

    let obj = {};

    for (let pair of pairs) {

        if(pair[0] == '$')break;

        // Split the pair into key and value
        let [key, value] = pair.split(':');
        
        // Add the key-value pair to the object
        obj[key] = value;

    }

    return obj
}

module.exports = {ObjtoString , StringToObj}