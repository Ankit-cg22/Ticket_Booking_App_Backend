const express =require('express');
const cors =require('cors');
const dotenv =require('dotenv')
const bodyParser =require('body-parser')

const app = express();
app.use(cors())
app.use(bodyParser.json());
dotenv.config()

const ticketsRouters = require('./routes/tickets.js')

app.use('/tickets' , ticketsRouters)

app.get('/' , (req , res)=>{
    res.json({status : "Success" , msg : "Welcome to ticket booking app server"})
})

app.listen(process.env.PORT , () => console.log(`Server is running on PORT : ${process.env.PORT}`))
