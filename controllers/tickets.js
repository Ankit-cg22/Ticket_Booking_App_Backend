const { getNextTicketId } = require("../utils/utilityFunctions")
const { insert_into_db, fetch_from_db } = require("../utils/DB_Operations")
const EventCollection = require('../models/Event.js')
require('dotenv').config()

const getTicketInfo = async (req, res) => {
    const ticketId = req.params.ticketId
    
    fetch_from_db(ticketId)
    .then((data)=>{
        console.log(data)
        const status = data.success

        // ticketId does not exist 
        if(status == false) return res.status(404).json({success :false , msg : "Ticket ID is not found."})

        //ticketId exists
        res.status(200).json({success:true , data : {ticketData: data.data.ticketData} })
    })
    .catch((err)=>{
        console.log(err)
        res.status(500).json({success:false , msg:"Internal server error"})

    })
}

const bookTicket = async (req, res) => {
    const ticketData = req.body.ticketData 
    const ticketId = getNextTicketId()
    const data = {
        ticketId ,
        ...ticketData ,
        checkedIn : 0 
    }

    try{
        const storedEvent = await EventCollection.findOne({eventId : ticketData.eventId})

        // event does not exist
        if(storedEvent === null)return res.status(404).json({success:false , msg:`No event found with eventId : ${ticketData.eventId}`})

        // all tickets for the event have already been booked
        if(storedEvent.ticketsBooked === storedEvent.totalTickets) return res.status(400).json({success:false , msg:"All tickets for this event have already been booked."})

        // insert the ticket info into the Harmonia DB
        const insertData = await insert_into_db(ticketId , data)
        console.log(insertData)

        // update the ticket count of the event 
        const ticketCountUpdateData = await EventCollection.updateOne({eventId : ticketData.eventId} , {ticketsBooked : storedEvent.ticketsBooked + 1})

        res.status(200).json({success:true , msg:"Ticket booked successfully." , data : {ticketData : insertData.data.ticketData}})

    }
    catch(error){
        console.log(error)
        res.status(500).json({success:false , msg:"Internal server error"})
    }
    
}

const markCheckedIn = async (req , res) =>{
    const ticketId = req.params.ticketId 

    try{
        const fetchData = await fetch_from_db(ticketId)
        console.log(fetchData)
        if(fetchData.success === false) return res.status(404).json({success:false , msg : "Ticket Id does not exist"})
        const ticketData = fetchData.data.ticketData
        ticketData.checkedIn = 1 

        const insertData = await insert_into_db(ticketId , ticketData)
        console.log(insertData)
        res.status(200).json({success:true , msg:`Ticket with ticketId=${ticketId} has been marked as 'Checked In' .` , data:{ticketData}})
    }
    catch(err){
        console.log(err)
        res.status(500).json({success:false , msg:"Internal server error"})
    }

}


module.exports = {getTicketInfo , bookTicket , markCheckedIn}