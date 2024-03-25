const mongoose = require('mongoose')

const EventSchema = new mongoose.Schema({
    eventId : {
        type : Number,
        required : true ,
        unique :true
    },
    eventName : {
        type:String , 
        required:true 
    },
    eventDescription:{
        type : String 
    },
    eventDate : {
        type : Date ,
        required: true 
    },
    totalTickets : {
        type : Number , 
        required : true 
    },
    ticketsBooked : {
        type : Number , 
        default : 0 
    }

})

const Event = mongoose.model('Event' , EventSchema)

module.exports = Event