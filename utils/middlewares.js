const { verifyJWTToken } = require('./utilityFunctions')

const authenticateJWTToken = (req, res , next) => {
    const jwtToken = req.body.jwtToken
    if(jwtToken == null) return res.status(401).json({success:false , msg:"No JWT token found in the request."})
    
    try{
        const user = verifyJWTToken(jwtToken)
        req.verifiedUser = user;
        next()
    }
    catch(err){
        return res.status(403).json({success:false , msg:"Invalid JWT token."})
    }

}

const verifyUserIsAdmin = (req , res , next) => {
    const verifiedUser = req.verifiedUser 
    if(verifiedUser.isAdmin === false)return res.status(401).json({success:false , msg:"You are not authorized to access this endpoint."})
    next();
}

module.exports = {authenticateJWTToken , verifyUserIsAdmin}