const express = require('express')
const { registerUser, loginUser, verifyOTP, sendAdminRequestMail, adminRequestAcceptance } = require('../controllers/auth')
const { authenticateJWTToken, verifyUserIsAdmin } = require('../utils/middlewares')
const router = express.Router()

// register
router.post('/register' , registerUser)

// login
router.post('/login' , loginUser)

// verify OTP 
router.post('/verifyOTP' , verifyOTP)

// send admin request mail
router.post('/sendAdminRequestMail' , authenticateJWTToken , verifyUserIsAdmin , sendAdminRequestMail)

// admin request acceptance 
router.post('/adminRequestAcceptance' , adminRequestAcceptance)

module.exports = router
