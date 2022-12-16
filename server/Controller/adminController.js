const jwt = require('jsonwebtoken')

/* ------------------------------- ADMIN LOGIN ------------------------------ */

const User = require("../Models/userSchema");

const postAdminLogin =(req,res)=>{

    try {       
        console.log(req.body);
        const adminMail = process.env.ADMIN_EMAIL
        const adminPass = process.env.ADMIN_PASS
         
        if(adminMail === req.body.email){
            console.log('email Ok');

            if(adminPass === req.body.password){
                const id = "admin4rt3"
                const token = jwt.sign({id},process.env.JWT_SECRET,{expiresIn:30000})
                res.status(200).json({adminToken:token,admin:true})
            }else{
                res.status(401).json('Incorrect Password')
            }
        }else{
            res.status(401).json('Email is not valid')
        }


    } catch (error) {
        console.log(error);
    }
}

/* --------------------------- GET USER MANAGEMENT -------------------------- */

const getUserManagement = (req,res)=>{
    console.log('hyyy');
    try {
        User.find().then(response=>{
            console.log(response);
            res.status(200).json(response)
        })

        
    } catch (error) {
        res.status(401).json({message:'Something went wrong! Try again'})
    }
}

/* ------------------------------- BLOCK USER ------------------------------- */

const blockUser = (req,res)=>{
    console.log(req.body.userId,'its body');

    try {
        User.findByIdAndUpdate({_id:req.body.userId},
            {
                $set:{status:"inactive"}
            }).then((response)=>{
                res.status(200).json({update:true,message:"User has been Blocked!"})
            }).catch((error)=>{
                console.log(error);
                res.json({update:false, message:"User not Blocked! Try again"})
            })
    } catch (error) {
        res.json(error.message)
    }
}


/* ------------------------------- UNBLOCK USER ------------------------------- */


const unblockUser =(req,res)=>{

    try {
        User.findByIdAndUpdate({_id:req.body.userId},
            {
                $set:{status:"active"}
            }).then(response=>{
                res.status(200).json({update:true,message:"User has been Ublocked"})
            }).catch(err=>{
                res.status(401).json({message:"Something went wrong"})
            })
    } catch (error) {
        res.json(error.message)
    }
}








module.exports={postAdminLogin,getUserManagement, blockUser, unblockUser}