const express = require('express')
const { getTicketInfo, bookTicket, markCheckedIn, getAllTicketsOfUser } = require('../controllers/tickets.js');
const { authenticateJWTToken, verifyUserIsAdmin } = require('../utils/middlewares.js');
const router = express.Router();

// get info of ticket
router.get('/getTicketInfo/:ticketId' ,authenticateJWTToken , getTicketInfo);

// book a ticket 
router.post('/bookTicket', authenticateJWTToken , bookTicket);

// mark a ticket as checkedIn
router.get('/markCheckedIn/:ticketId' , authenticateJWTToken , verifyUserIsAdmin , markCheckedIn);

// get all tickets of an user 
router.get('/getAllTickets/:userId' , authenticateJWTToken ,  getAllTicketsOfUser)

module.exports = router 