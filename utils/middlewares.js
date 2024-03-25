const jwt = require('jsonwebtoken')

const authenticateJWTToken = (req, res , next) => {
    const jwtToken = req.body.jwtToken
    if(jwtToken == null) return res.status(401).json({success:false , msg:"No JWT token found in the requst ."})
    
    jwt.verify(jwtToken , process.env.JWT_ACCESS_TOKEN_SECRET , (err, user)=>{
        // token is not valid
        if(err) return res.status(403).json({success:false , msg:"Invalid JWT token ."})

        // token in valid 
        req.verifiedUser = user;
        next()
    })
}

const verifyUserIsAdmin = (req , res , next) => {
    const verifiedUser = req.verifiedUser 
    if(verifiedUser.isAdmin === false)return res.status(401).json({success:false , msg:"You are not authorized to access this endpoint."})
    next();
}

module.exports = {authenticateJWTToken , verifyUserIsAdmin}