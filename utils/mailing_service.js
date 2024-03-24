const nodemailer = require('nodemailer')
const { generateOTP } = require('./utilityFunctions')
const bcrypt = require('bcrypt')
const UserOTPVerification = require('../models/UserOTPVerification')
require('dotenv').config()

let transporter = nodemailer.createTransport({
    service : "gmail" ,
    host :"smtp.gmail.com" ,
    port:587 ,
    secure:false,
    auth : {
        user : process.env.NODEMAILER_EMAIL ,
        pass : process.env.NODEMAILER_APP_PASSWORD
    }

})

const sendOTPVerificationEmail = (userId , email) => {
    return new Promise(async (resolve , reject)=>{
        try{
            const OTP = generateOTP()
    
            const mailOptions = {
                from : process.env.NODEMAILER_EMAIL,
                to : email ,
                subject : 'Verify your email id.',
                html : `<p> <b>${OTP}</b> is your OTP for verification on ticket booking app.</p><br> <p>This OTP is valid for <b>1 hour</b></p> <br> <p>Thank You</p><p><b>Ticket Booking App Team</b></p> `
            }

            // hash the OTP and store it 
            const hashedOTP = await bcrypt.hash(OTP , 10);
    
            const newOTPVerificationEntry = await new UserOTPVerification({
                userId ,
                otp : hashedOTP , 
                createdAt : Date.now() , 
                expiresAt : Date.now() + (60 * 60 * 1000) 
            })
    
            await newOTPVerificationEntry.save()
    
            await transporter.sendMail(mailOptions)
    
            resolve()
        }
        catch(error){
            console.log(error)
            reject()
        }
    })
    
}

module.exports = {sendOTPVerificationEmail}