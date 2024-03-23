const express = require('express')
const { getTicketInfo, bookTicket, markCheckedIn } = require('../controllers/tickets.js');
const router = express.Router();

// get info of ticket
router.get('/getTicketInfo/:ticketId' , getTicketInfo);

// book a ticket 
router.post('/bookTicket' , bookTicket);

// mark a ticket as checkedIn
router.get('/markCheckedIn/:ticketId' , markCheckedIn);

module.exports = router 