const { getNextTicketId } = require("../utils/utilityFunctions")
const { insert_into_db, fetch_from_db } = require("../utils/DB_Operations")
require('dotenv').config()

const getTicketInfo = async (req, res) => {
    const ticketId = req.params.ticketId
    
    fetch_from_db(ticketId)
    .then((data)=>{
        console.log(data)
        const status = data.success

        // ticketId does not exist 
        if(status == false) return res.status(404).json({success :false , msg : "Ticket ID is not found."})

        //ticketId exists
        return res.status(200).json({success:true , data : {ticketData: data.data.ticketData} })
    })
    .catch(()=>{
        return res.status(500).json({success:false , msg:"Internal server error"})

    })
}

const bookTicket = async (req, res) => {
    const ticketData = req.body 
    const ticketId = getNextTicketId()
    const data = {
        ticketId ,
        ...ticketData ,
        checkedIn : 0 
    }

    insert_into_db(ticketId , data)
    .then((data)=>{
        console.log(data)
        return res.status(200).json({success:true , msg:"Ticket booked successfully." , data : {ticketData : data.data.ticketData}})
    })
    .catch((err)=>{
        return res.status(500).json({success:false , msg:"Internal server error."})
    })
    
}

const markCheckedIn = async (req , res) =>{
    const ticketId = req.params.ticketId 

    try{
        const data = await fetch_from_db(ticketId)
        if(data.success === false) return res.status(404).json({success:false , msg : "Ticket Id does not exist"})
        const ticketData = data.data.ticketData
        ticketData.checkedIn = 1 

        const updateData = await insert_into_db(ticketId , ticketData)
        res.status(200).json({success:true , msg:`Ticket with ticketId=${ticketId} has been marked as 'Checked In' .` , data:{ticketData:data.data.ticketData}})
    }
    catch(err){
        res.status(500).json({success:false , msg:"Internal server error"})
    }

}


module.exports = {getTicketInfo , bookTicket , markCheckedIn}