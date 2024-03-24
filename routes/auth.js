const express = require('express')
const { registerUser, loginUser, authenticateJWTToken, testController } = require('../controllers/auth')
const router = express.Router()

router.post('/register' , registerUser)
router.post('/login' , loginUser)

// pass authenticateJWTToken method to other routes as a middleware
// inside the controller , you can access the user using req.verifiedUser

router.post('/test' , authenticateJWTToken , testController)

module.exports = router
