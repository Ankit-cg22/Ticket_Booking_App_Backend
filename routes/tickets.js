const express = require('express')
const { getTicketInfo, bookTicket, markCheckedIn } = require('../controllers/tickets.js');
const { authenticateJWTToken, verifyUserIsAdmin } = require('../utils/middlewares.js');
const router = express.Router();

// get info of ticket
router.post('/getTicketInfo/:ticketId' ,authenticateJWTToken , getTicketInfo);

// book a ticket 
router.post('/bookTicket', authenticateJWTToken , bookTicket);

// mark a ticket as checkedIn
router.post('/markCheckedIn/:ticketId' , authenticateJWTToken , verifyUserIsAdmin , markCheckedIn);

module.exports = router 