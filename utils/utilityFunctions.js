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
        throw Error('Invalid JWT token.')
    }
}


module.exports = {getNextTicketId , generateOTP , getNextEventId , verifyJWTToken}