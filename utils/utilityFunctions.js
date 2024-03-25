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


module.exports = {getNextTicketId , generateOTP , getNextEventId}