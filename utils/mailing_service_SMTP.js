const { SMTPConnection } = require('smtp-connection');
const { generateOTP } = require('./utilityFunctions');
const bcrypt = require('bcrypt');
const UserOTPVerification = require('../models/UserOTPVerification');
require('dotenv').config();

// Function to send OTP verification email
const sendOTPVerificationEmail = async (userId, email) => {
    try {
        // Generate OTP
        const OTP = generateOTP();

        // Hash the OTP
        const hashedOTP = await bcrypt.hash(OTP, 10);

        // Create a new OTP verification entry
        const newOTPVerificationEntry = new UserOTPVerification({
            userId,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + (parseInt(process.env.OTP_VALIDITY_IN_MINUTES) * 60 * 1000)
        });
        await newOTPVerificationEntry.save();

        // Construct email content
        const emailContent = `
            From: ${process.env.NODEMAILER_EMAIL}
            To: ${email}
            Subject: Verify your email id
            
            ${OTP} is your OTP for verification on the ticket booking app.
            This OTP is valid for 1 hour.
            
            Thank You
            Ticket Booking App Team
        `.trim();

        // Connect to SMTP server
        const connection = new SMTPConnection({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_APP_PASSWORD
            }
        });

        // Send email
        await connection.connect();
        await connection.send({
            from: process.env.NODEMAILER_EMAIL,
            to: email,
            data: emailContent
        });
        await connection.quit();
    } catch (error) {
        console.error('Error sending OTP verification email:', error);
        throw new Error('Failed to send OTP verification email.');
    }
};

// Function to send admin request email
const sendAdminRequestEmail = async (user, jwtToken) => {
    try {
        // Construct admin request link
        const adminRequestLink = `${process.env.FRONTEND_URL}/adminRequestAcceptance/${jwtToken}`;

        // Construct email content
        const emailContent = `
            From: ${process.env.NODEMAILER_EMAIL}
            To: ${user.email}
            Subject: Admin role request
            
            Hello ${user.name},
            Our team requests you to take up the role as an Admin.
            If you accept the offer, please click on the link below:
            
            ${adminRequestLink}
            
            Thank You
            Ticket Booking App Team
        `.trim();

        // Connect to SMTP server
        const connection = new SMTPConnection({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_APP_PASSWORD
            }
        });

        // Send email
        await connection.connect();
        await connection.send({
            from: process.env.NODEMAILER_EMAIL,
            to: user.email,
            data: emailContent
        });
        await connection.quit();
    } catch (error) {
        console.error('Error sending admin request email:', error);
        throw new Error('Failed to send admin request email.');
    }
};

module.exports = { sendOTPVerificationEmail, sendAdminRequestEmail };
