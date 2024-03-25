const jwt = require('jsonwebtoken')

let ticketId = 1010;
let eventId = 2020;

function getNextTicketId(){
    ++ticketId;
    return ticketId;
}

function getNextEventId(){
    ++eventId;
    return eventId ;
}

const generateOTP = () => {
    const OTP = `${Math.floor(1000 + Math.random()*9000)}`
    return OTP;
}

const verifyJWTToken = (jwtToken) => {
    try {
        const decodedData = jwt.verify(jwtToken , process.env.JWT_ACCESS_TOKEN_SECRET)
        return decodedData
    } catch (error) {
        throw new Error("Invalid JWT token.")
    }
}

const signAuthJWTToken = (tokenData) => {
    tokenData.tokenExpiresAt = Date.now() + (parseInt(process.env.JWT_TOKEN_VALIDITY_IN_MINUTES) *60 * 1000)
    const jwtToken = jwt.sign(tokenData , process.env.JWT_ACCESS_TOKEN_SECRET)
    return jwtToken
}


module.exports = {getNextTicketId , generateOTP , getNextEventId , verifyJWTToken , signAuthJWTToken}