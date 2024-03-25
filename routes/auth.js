const express = require('express')
const { registerUser, loginUser, testController, verifyOTP, sendAdminRequestMail, adminRequestAcceptance } = require('../controllers/auth')
const { authenticateJWTToken, verifyUserIsAdmin } = require('../utils/middlewares')
const router = express.Router()

router.post('/register' , registerUser)
router.post('/login' , loginUser)

// pass authenticateJWTToken method to other routes as a middleware
// inside the controller , you can access the user using req.verifiedUser

router.post('/test' , authenticateJWTToken , testController)

// verify OTP 
router.post('/verifyOTP' , verifyOTP)

// send admin request mail
router.post('/sendAdminRequestMail' , authenticateJWTToken , verifyUserIsAdmin , sendAdminRequestMail)

// admin request acceptance 
router.post('/adminRequestAcceptance' , adminRequestAcceptance)

module.exports = router
