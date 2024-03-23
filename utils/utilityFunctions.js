let ticketId = 1010;

function getNextTicketId(){
    ++ticketId;
    return ticketId;
}

module.exports = {getNextTicketId}