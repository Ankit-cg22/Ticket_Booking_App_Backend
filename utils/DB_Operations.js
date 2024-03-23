const { haromia_db_insert, harmonia_db_search } = require("./Harmonia_DB_Operations")
const { RSA_encrypt, RSA_decrypt } = require("./RSA")
const { ObjtoString, StringToObj } = require("./parsing")

function insert_into_db(ticketId , data){
    return new Promise((resolve , reject)=>{
        const str = ObjtoString(data)

        const encryptedData = RSA_encrypt(str)

        const db_server_data = {
            key : ticketId ,
            value : encryptedData
        }

        haromia_db_insert(db_server_data)
        .then((data)=>{
            resolve(data)
        })
        .catch((err)=>{
            reject(err)
        })
    })
}

function fetch_from_db(ticketId){
    return new Promise((resolve , reject)=>{
        harmonia_db_search(ticketId)
        .then((data)=>{
            const status = data.success
            // ticketId does not exist 
            if(status == false) resolve({success:false , data:{timeTakenInMicroSeconds : data.data.timeTakenInMicroSeconds}})

            // ticketId exists
            // get the encrypted data
            const encrypted_data = data.data.value
            // decrypt to get the string
            const str = RSA_decrypt(encrypted_data)
            // parse string into object
            const ticketData = StringToObj(str)

            // return the data 
            resolve({success:true , data : { ticketData , timeTakenInMicroSeconds : data.data.timeTakenInMicroSeconds }})
        })
        .catch((err)=>{
            reject(err)
        })
    })
}

module.exports = {insert_into_db,fetch_from_db}