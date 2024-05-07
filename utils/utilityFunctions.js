const jwt = require('jsonwebtoken');
const EventsCollection = require('../models/Event');
const TicketIdsCollection = require('../models/TicketIds')

async function getNextTicketId(){
    try{
        const data = await TicketIdsCollection.find().sort({"ticketId" : -1}).limit(1)
        let ticketId;
        if(data.length === 0) ticketId = 1011;
        else ticketId = data[0].ticketId + 1;
        await TicketIdsCollection.insertMany({ticketId})
        return ticketId;
    }
    catch(err){
        throw new Error('Unable to generate ticket Id.')
    }
}

async function getNextEventId(){
    try{
        const data = await EventsCollection.find().sort({"eventId" : -1}).limit(1)
        if(data.length === 0)return 2021;
        const eventId = data[0].eventId + 1 ;
        return eventId;
    }
    catch(err){
        throw new Error('Unable to generate event Id .')
    }
}
async function getCurrEventId(){
    try{
        const data = await EventsCollection.find().sort({"eventId" : -1}).limit(1)
        if(data.length === 0)return 2021;
        const eventId = data[0].eventId ;
        return eventId;
    }
    catch(err){
        throw new Error('Unable to generate event Id .')
    }
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
    tokenData.tokenExpiresAt = Date.now() + (parseInt(process.env.JWT_TOKEN_VALIDITY_IN_HOURS) * 60 *60 * 1000)
    const jwtToken = jwt.sign(tokenData , process.env.JWT_ACCESS_TOKEN_SECRET)
    return jwtToken
}


module.exports = {getNextTicketId , generateOTP , getNextEventId , verifyJWTToken , signAuthJWTToken}