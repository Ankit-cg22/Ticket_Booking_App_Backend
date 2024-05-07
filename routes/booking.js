const Router  = require("express");
const Booking = require("../models/Booking")

const router = Router()

// Get collection for Booking
router.get("/", async (req, res) =>{
    try {
        const data = await Booking.find()
        res.json(data)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

//Create new individual
router.post("/", async (req, res) =>{
    const data = new Booking({
        name: req.body.name,
        date: req.body.date,
        day: req.body.day,
        time: req.body.time,
        venues_name: req.body.venues_name,
        silver: req.body.silver,
        platinium: req.body.platinium,
        price: req.body.price,
        total_price: req.body.total_price,
    })
    try {
        const newData = await data.save()
        res.status(200).json("Booking Added!")
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

//Get individual
router.get("/:id", getBooking, (req, res) =>{
    res.status(200).json(res.bookings)
})



//delete individual
router.delete("/:id", getBooking, async (req, res) =>{
    try {
        await res.bookings.remove()
        res.status(200).json({message: "Booking Deleted succesfully"})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
async function getBooking(req,res,nxt) {
    let bookings;
    try {
        bookings = await Booking.findById(req.params.id)
        if(bookings == null){
            return res.status(400).json({message: "Booking does not exist"})
        }
    } catch (error) {
        res.status(500).json({message: error.message})
    }
    res.bookings = bookings
    nxt()
}
module.exports = router;