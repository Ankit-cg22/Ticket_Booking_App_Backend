const { default: axios } = require("axios")
require('dotenv').config()
const DB_SERVER_URL = process.env.DB_SERVER_URL

function haromia_db_insert(data_to_insert) {
    return new Promise((resolve , reject)=>{
        axios.post(DB_SERVER_URL+"/insert" , data_to_insert)
        .then((data)=>{
            resolve(data.data)
        })
        .catch((err)=>{
            reject(err)
        })
    })
}

function harmonia_db_search(id) {
    const db_server_data = {
        key : id
    }
    return new Promise((resolve , reject)=>{
        axios.post(DB_SERVER_URL+'/search',db_server_data)
        .then((data)=>{
            resolve(data.data)
        })
        .catch((err)=>{
            reject(err)
        })
    })
}

module.exports = {haromia_db_insert , harmonia_db_search}