const jwt = require('jsonwebtoken')

const  verifyJWT = (req,res,next)=>{
    const token = req.headers.accesstoken;
    if(!token){
        res.status(403).json("Account verification failed")
    }else {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) =>{
            if(err){
                console.log(err);
                res.status(403).json({auth:false, message:"Authentication Failed!"})
            }else{
                req.userId = decoded.id;
                next()
            }
        })
    }
} 

module.exports = verifyJWT