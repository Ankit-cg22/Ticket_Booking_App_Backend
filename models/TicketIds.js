const mongoose = require('mongoose')
const TicketIdsSchema = new mongoose.Schema({
    ticketId : {
        type : Number , 
        required: true 
    }
})

const TicketIds = mongoose.model('TicketIds' , TicketIdsSchema)

module.exports = TicketIds 