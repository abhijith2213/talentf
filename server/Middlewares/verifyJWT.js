const jwt = require('jsonwebtoken')

const verifyJWT = (req,res,next)=>{
    console.log('in verify');
    const token = req.headers.accesstoken;
    console.log(token,'its token');
    if(!token){
        res.status(403).json("Account verification failed")
    }else {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) =>{
            if(err){
                console.log(err);
                res.status(403).json({auth:false, message:"Authentication Failed!"})
            }else{
                req.userId = decoded.id;
                console.log('verify ok');
                next()
            }
        })
    }
} 

module.exports = verifyJWT