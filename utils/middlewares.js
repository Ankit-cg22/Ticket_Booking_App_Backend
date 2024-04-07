const { verifyJWTToken } = require('./utilityFunctions')

const authenticateJWTToken = (req, res , next) => {
    const authHeader = req.headers['authorization']
    const jwtToken = authHeader && authHeader.split(' ')[1]
    if(jwtToken == null) return res.status(401).json({success:false , msg:"No JWT token found in the request."})
    
    try{
        const tokenData = verifyJWTToken(jwtToken)
        
        if((tokenData.tokenExpiresAt) && (tokenData.tokenExpiresAt < Date.now())){
            return res.status(400).json({success:false , msg:"Expired JWT token."})
        }
        delete tokenData.tokenExpiresAt
        req.verifiedUser = tokenData;
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