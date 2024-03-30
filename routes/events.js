const express = require('express')
const router = express.Router()
const {getAllFutureEvents,getEventInfo, createEvent, updateEvent, deleteEvent } = require('../controllers/events.js')
const { authenticateJWTToken, verifyUserIsAdmin } = require('../utils/middlewares.js')

// returns all events with eventDate >= currentDate
router.post('/getAllFutureEvents', authenticateJWTToken ,getAllFutureEvents) 

// get info of a particular event
router.post('/getEventInfo/:eventId' , authenticateJWTToken , getEventInfo)

// create an event
router.post('/createEvent' , authenticateJWTToken , verifyUserIsAdmin , createEvent)
    
// update event 
router.post('/updateEvent/:eventId' , authenticateJWTToken , verifyUserIsAdmin , updateEvent)

//delete event
router.post('/deleteEvent/:eventId' , authenticateJWTToken , verifyUserIsAdmin , deleteEvent)

module.exports = router