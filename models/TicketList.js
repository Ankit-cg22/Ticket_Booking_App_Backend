const mongoose = require('mongoose')
const TicketListSchema = new mongoose.Schema({
    userId : {
        type : String , 
        required: true 
    },
    ticketList:{
        type : [Number] ,
        required : true , 
        default : []
    }
})

const TicketList = mongoose.model('TicketList' , TicketListSchema)

module.exports = TicketList 