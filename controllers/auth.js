const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const users= []

const registerUser = async (req , res)=>{
    const userData = req.body 
    try{

        const storedUser = users.find(user => user.email === userData.email)

        if(storedUser != null) return res.status(409).json({success:false , msg:"Email id already exists ."})

        const hashedPassword = await bcrypt.hash(userData.password , 10)
        userData.password = hashedPassword

        // store the user 
        users.push(userData)

        const newUser = {name:userData.name , email:userData.email}
        const jwtToken= jwt.sign(newUser , process.env.JWT_ACCESS_TOKEN_SECRET)
        
        res.status(201).json({success:true , msg :"User registered successfully" , userData : newUser , jwtToken})
    }
    catch(err){
        res.status(500).json({success:false , msg:"Internal server error"})
    }
}

const loginUser = async(req , res) => {
    const userData = req.body
    const storedUser = users.find(user => user.email === userData.email)

    if(storedUser == null) return res.status(404).json({success:false, msg : "No user found with this email id."})

    try {
        const comparisonResult = await bcrypt.compare(req.body.password , storedUser.password)
        if(comparisonResult === true){
            const verfiedUser = {name : storedUser.name , email:storedUser.email}
            const jwtToken = jwt.sign(verfiedUser , process.env.JWT_ACCESS_TOKEN_SECRET)
            res.status(200).json({success:true, msg:"User logged in." , userData : verfiedUser , jwtToken})
        }
        else{
            res.status(401).json({success:false , msg:"Invalid credentials"})
        }

    } catch (error) {
        res.status(500).json({success:false , msg:"Internal server error."})
    }

}

const testController = (req ,res) =>{
    const verifiedUser = req.verifiedUser
    res.status(200).json({verifiedUser})
}

const authenticateJWTToken = (req, res , next) => {
    const jwtToken = req.body.jwtToken
    if(jwtToken == null) return res.status(401).json({success:false , msg:"No JWT token found in the requst ."})
    
    jwt.verify(jwtToken , process.env.JWT_ACCESS_TOKEN_SECRET , (err, user)=>{
        if(err) return res.status(403).json({success:false , msg:"Invalid JWT token ."})
        req.verifiedUser = user;
        next()
    })
}

module.exports = {registerUser , loginUser , authenticateJWTToken , testController}