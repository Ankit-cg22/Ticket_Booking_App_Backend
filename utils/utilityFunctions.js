let ticketId = 1010;

function getNextTicketId(){
    ++ticketId;
    return ticketId;
}

const generateOTP = () => {
    const OTP = `${Math.floor(1000 + Math.random()*9000)}`
    return OTP;
}


module.exports = {getNextTicketId , generateOTP}