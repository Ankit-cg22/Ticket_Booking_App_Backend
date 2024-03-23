const express = require('express')
const { getTicketInfo, bookTicket } = require('../controllers/tickets.js');
const router = express.Router();

// get info of ticket
router.get('/getTicketInfo/:ticketId' , getTicketInfo);

// book a ticket 
router.post('/bookTicket' , bookTicket);



module.exports = router 