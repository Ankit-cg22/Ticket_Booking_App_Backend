const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const UserCollection = require('../models/User.js')
const { sendOTPVerificationEmail, sendAdminRequestEmail } = require('../utils/mailing_service.js')
const UserOTPVerificationCollection = require('../models/UserOTPVerification.js')
const { verifyJWTToken, signAuthJWTToken } = require('../utils/utilityFunctions.js')

const registerUser = async (req , res)=>{
    const userData = req.body 
    try{

        //check if email id already exists
        const existingUser = await UserCollection.findOne({email : userData.email})
        if(existingUser) return res.status(409).json({success:false , msg:"Email id already exists ."})

        //hash the password 
        const hashedPassword = await bcrypt.hash(userData.password , 10)
        userData.password = hashedPassword

        // store the user 
        const savedUser = await UserCollection.insertMany(userData)
        const newUser = {userId : savedUser[0]._id , name:savedUser[0].name , email:savedUser[0].email , isAdmin:savedUser[0].isAdmin , isVerified : savedUser[0].isVerified}

        await sendOTPVerificationEmail( newUser.userId , newUser.email);

        res.status(201).json({success:true , msg :`New user created. OTP verfication email has been sent to emailID : ${newUser.email}` , userData : newUser })
    }
    catch(err){
        console.log(err)
        res.status(500).json({success:false , msg:"Internal server error"})
    }
}

const loginUser = async(req , res) => {
    const userData = req.body

    // check for stored user with the provided email id 
    const storedUser = await UserCollection.findOne({email : userData.email})

    // no user found with the provided email id 
    if(storedUser == null) return res.status(404).json({success:false, msg : "No user found with this email id."})

    try {
        // verify the password
        const comparisonResult = await bcrypt.compare(req.body.password , storedUser.password)

        if(comparisonResult === true){
            const verifiedUser = {userId : storedUser._id , name:storedUser.name , email:storedUser.email , isAdmin:storedUser.isAdmin , isVerified : storedUser.isVerified}

            // sign the JWT
            const jwtToken = signAuthJWTToken(verifiedUser)

            res.status(200).json({success:true, msg:"User logged in." , userData : verifiedUser , jwtToken})
        }
        else{
            // wrong password 
            res.status(401).json({success:false , msg:"Invalid credentials"})
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({success:false , msg:"Internal server error."})
    }

}

const verifyOTP = async (req ,res)=>{
    try{
        const userId = req.body.userId
        const receivedOTP = req.body.otp

        if(!userId || !receivedOTP)return res.status(400).json({success:false , msg : "Please provide both userId and OTP for verfication."})

        const storedOTPInfo = await UserOTPVerificationCollection.findOne({userId})

        if(storedOTPInfo === null) return res.status(400).json({success:false , msg :"Either userId does not exist or has been verfied already ."})

        const {expiresAt} = storedOTPInfo 

        if(expiresAt < Date.now()){
            await UserOTPVerificationCollection.deleteOne({userId})
            return res.status(400).json({success:false , msg : "This OTP has expired."})
        }
        
        const hashedOTP = storedOTPInfo.otp 

        const OTPComparisonResult = await bcrypt.compare(receivedOTP , hashedOTP)

        if(OTPComparisonResult === false)return res.status(400).json({success:false , msg:"Wrong OTP provided. Please check your inbox for correct OTP."})

        await UserCollection.updateOne({_id : userId} , {isVerified : true})
        await UserOTPVerificationCollection.deleteOne({userId})
        
        const updatedUser = await UserCollection.findOne({_id : userId})
        const userData = {
            userId : updatedUser._id , 
            name : updatedUser.name ,
            email : updatedUser.email ,
            isAdmin : updatedUser.isAdmin , 
            isVerified : updatedUser.isVerified
        }

        // sign the JWT
        const jwtToken = signAuthJWTToken(userData)

        res.status(200).json({success:true, msg:"User has been successfully verified." , userData , jwtToken})

    }
    catch(error){
        console.log(error)
        res.status(500).json({success:false , msg:"Internal server error"})
    }
}

const sendAdminRequestMail = async(req , res) => {
    try{
        const {email} = req.body.userData
        
        const storedUser = await UserCollection.findOne({email})

        if(storedUser === null) return res.status(404).json({success:false , msg : `Email id ${email} is not registered .You can send admin mail to a user who is already registered.`})

        if(storedUser.isAdmin) return res.status(400).json({success:false , msg:`User with email id : ${email} is already an admin.`})

        // token to provide in the mail
        const tokenData = { email }

        // sign a jwt token 
        const jwtToken = jwt.sign(tokenData , process.env.JWT_ACCESS_TOKEN_SECRET)

        await sendAdminRequestEmail(storedUser , jwtToken)

        res.status(200).json({success:true , msg:`Admin request email has been sent to email id : ${email}`})

    }
    catch(error){
        console.log(error)
        res.status(500).json({success:false , msg:"Internal server error."})
    }
}

const adminRequestAcceptance = async (req , res) => {
    try {
        const {token} = req.body
        if(token == null) return res.status(400).json({success:false , msg:"Token is not provided."})

        let tokenData ; 
        try{
            tokenData = verifyJWTToken(token)
        }
        catch(error){
            return res.status(400).json({success:false , msg:"Invalid JWT token"})
        }
        
        const {email} = tokenData

        const storedUser = await UserCollection.findOne({email})

        if(storedUser === null)return res.status(400).json({success:false , msg:`The user with email id : ${email} does not exist any more.`})

        if(storedUser.isAdmin) return res.status(400).json({success:false , msg:`User with email id : ${email} is already an admin.`})

        await UserCollection.findByIdAndUpdate(storedUser._id , {isAdmin:true})

        return res.status(200).json({success:true , msg:`User with email id : ${email} has been successfully appointed as Admin.`})


    } catch (error) {
        console.log(error)
        res.status(500).json({success:false , msg:"Internal server error."})
    }
}


module.exports = {registerUser , loginUser  , verifyOTP , sendAdminRequestMail , adminRequestAcceptance}