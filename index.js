const express =require('express');
const cors =require('cors');
const dotenv =require('dotenv')
const bodyParser =require('body-parser')

const app = express();
app.use(cors())
app.use(bodyParser.json());
dotenv.config()

const ticketsRoutes = require('./routes/tickets.js')
const authRoutes = require('./routes/auth.js')

app.use('/tickets' , ticketsRoutes)
app.use('/auth' , authRoutes)

app.get('/' , (req , res)=>{
    res.json({status : "Success" , msg : "Welcome to ticket booking app server"})
})

app.listen(process.env.PORT , () => console.log(`Server is running on PORT : ${process.env.PORT}`))
