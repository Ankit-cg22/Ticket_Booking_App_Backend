const EventCollection = require('../models/Event.js')
const { getNextEventId } = require('../utils/utilityFunctions.js')

// Get collections for Future Events
const getAllFutureEvents = async (req , res) => {
    try{
        const currentDate = new Date()
          // Find all events with eventDate greater than or equal to current date
        const eventsData = await EventCollection.find({eventDate : { $gte : currentDate }})

        res.status(200).json({success:true , eventsData })
    }
    catch(error){
        console.log(error)
        res.status(500).json({success:false , msg:"Internal server error."})
    }
}

// Get Event Info based on Event ID
const getEventInfo = async (req , res) => {
    try{
        const eventId = req.params.eventId 
        // Find event information based on eventId
        const storedEvent = await EventCollection.findOne({eventId})

        if(storedEvent === null) return res.status(404).json({success:false , msg:`No event found with eventId = ${eventId}`})

        return res.status(200).json({success:true , eventData :storedEvent})

    }
    catch(error){
        console.log(error)
        res.status(500).json({success:false , msg:"Internal server error"})
    }
}

//create an  Event
const createEvent = async(req, res) => {
    try{
        const eventData = req.body.eventData 
        // Check if all required event details are provided
        if(!eventData.eventName || !eventData.eventDate || !eventData.totalTickets) {
            return res.status(400).json({success:false , msg : "Please provide all of the following details : eventName , eventDate , totalTickets"})
        }

        eventData.eventId = await getNextEventId()
        // Save the event data to the database
        const savedEvent = await EventCollection.insertMany(eventData)

        res.status(200).json({status:true , eventData : savedEvent})

    }
    catch(error){
        console.log(error)
        res.status(500).json({success:false , msg:"Internal server error."})
    }
}
//Update an Event
const updateEvent = async (req , res) => {

    try{
        const eventId = req.params.eventId 
        const eventData = req.body.eventData
        // Check if all required event details are provided
        if(!eventData.eventName || !eventData.eventDate || !eventData.totalTickets) {
            return res.status(400).json({success:false , msg : "Please provide all of the following details : eventName , eventDate , totalTickets"})
        }
        // Find the event based on eventId
        const storedEvent = await EventCollection.findOne({eventId})
        
        if(storedEvent === null)return res.status(404).json({success:true , msg:`No event exists with eventId = ${eventId}`})
         // Update the event data in the database
        await EventCollection.updateOne({_id : storedEvent._id} , eventData) 
       
        const updatedEvent = await EventCollection.findOne({eventId})

        return res.status(200).json({success:true , msg:"Event updated successfully", eventData : updatedEvent})

    }
    catch(error){
        console.log(error)
        return res.status(500).json({success:false , msg:"Internal server error."})
    }
}

//Delete an Event
const deleteEvent = async (req , res) => {
    try {
        const eventId = req.params.eventId 
        // Find the event based on eventId
        const storedEvent = await EventCollection.findOne({eventId})
        // If event does not exist, respond with 404 Not Found
        if(storedEvent === null)return res.status(404).json({success:false , msg:`No event exists with eventId = ${eventId}`})
        // Delete the event from the database
        await EventCollection.deleteOne({_id : storedEvent._id})

        return res.status(200).json({success:true , msg:`Event with eventId = ${eventId} has been successfully deleted.`})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false , msg:"Internal server error."})
    }
}

module.exports = {getAllFutureEvents , getEventInfo , createEvent , updateEvent , deleteEvent}