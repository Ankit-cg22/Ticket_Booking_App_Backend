const EventCollection = require('../models/Event.js')
const { getNextEventId } = require('../utils/utilityFunctions.js')

const getAllFutureEvents = async (req , res) => {
    try{
        const currentDate = new Date()
        const eventsData = await EventCollection.find({eventDate : { $gte : currentDate }})

        res.status(200).json({success:true , eventsData })
    }
    catch(error){
        console.log(error)
        res.status(500).json({success:false , msg:"Internal server error."})
    }
}

const getEventInfo = async (req , res) => {
    try{
        const eventId = req.params.eventId 
        const storedEvent = await EventCollection.findOne({eventId})

        if(storedEvent === null) return res.status(404).json({success:false , msg:`No event found with eventId = ${eventId}`})

        return res.status(200).json({success:true , eventData :storedEvent})

    }
    catch(error){
        console.log(error)
        res.status(500).json({success:false , msg:"Internal server error"})
    }
}

const createEvent = async(req, res) => {
    try{
        const eventData = req.body.eventData 

        if(!eventData.eventName || !eventData.eventDate || !eventData.totalTickets) {
            return res.status(400).json({success:false , msg : "Please provide all of the following details : eventName , eventDate , totalTickets"})
        }

        eventData.eventId = getNextEventId()

        const savedEvent = await EventCollection.insertMany(eventData)

        res.status(200).json({status:true , eventData : savedEvent})

    }
    catch(error){
        console.log(error)
        res.status(500).json({success:false , msg:"Internal server error."})
    }
}

const updateEvent = async (req , res) => {

    try{
        const eventId = req.params.eventId 
        const eventData = req.body.eventData
        
        if(!eventData.eventName || !eventData.eventDate || !eventData.totalTickets) {
            return res.status(400).json({success:false , msg : "Please provide all of the following details : eventName , eventDate , totalTickets"})
        }

        const storedEvent = await EventCollection.findOne({eventId})
        
        if(storedEvent === null)return res.status(404).json({success:true , msg:`No event exists with eventId = ${eventId}`})

        await EventCollection.updateOne({_id : storedEvent._id} , eventData) 

        const updatedEvent = await EventCollection.findOne({eventId})

        return res.status(200).json({success:true , msg:"Event updated successfully", eventData : updatedEvent})

    }
    catch(error){
        console.log(error)
        return res.status(500).json({success:false , msg:"Internal server error."})
    }
}

const deleteEvent = async (req , res) => {
    try {
        const eventId = req.params.eventId 

        const storedEvent = await EventCollection.findOne({eventId})
        
        if(storedEvent === null)return res.status(404).json({success:false , msg:`No event exists with eventId = ${eventId}`})

        await EventCollection.deleteOne({_id : storedEvent._id})

        return res.status(200).json({success:true , msg:`Event with eventId = ${eventId} has been successfully deleted.`})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false , msg:"Internal server error."})
    }
}

module.exports = {getAllFutureEvents , getEventInfo , createEvent , updateEvent , deleteEvent}