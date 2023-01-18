const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const jwt_decode = require( "jwt-decode")
const User = require("../Models/userSchema")
const NotificationModel = require("../Models/notificationSchema")
const userVerification = require("../Models/userVerificationSchema")

/* ----------------------------- CREATE ACCOUNT ----------------------------- */

const postCreateAccount = async (req, res) => {
   try {
      let { fullName, userName, email, phone, password, accountType } = req.body
         password = await bcrypt.hash(password, 10)
         User.create({
            fullName,
            userName,
            email,
            phone,
            password,
            accountType,
         })
            .then((response) => {
               NotificationModel.create({ userId: response._id })
               res.status(200).json(response._id)
            })
            .catch((error) => {
               res.status(503).json("Something went wrong")
            })
      // }
   } catch (error) {
      res.status(503).json("Something went wrong")
   }
}

/* ----------------------------- SiGN UP OTP SEND----------------------------- */



const sendUserOtp = async (req, res) => {

const {email,userName} =req.body


   try {    
      const usedData = await User.findOne({ $or: [{ email }, { userName }] })
      if (usedData) {
         if (usedData.userName === userName) {
            res.status(409).json({message:"userName not Available"})
         } else if (usedData.email === email){
            res.status(409).json({message:"Email already Registered, Please Login"})
         }
      }else{
         otpGenerate(email,res).then((response)=>{
         })
      } 
   } catch (error) {
      res.status(500).json(error)
   }

}

/* ------------------------- OTP GENERATE  FUNCTION ------------------------- */

// Nodemailer configuration

let transporter = nodemailer.createTransport({
   service: "gmail",
   auth: {
      user: process.env.NODEMAILER,
      pass: process.env.NODEMAILER_PASS,
   },
})

const otpGenerate =async(email,res,link)=>{
   try {
      const OTP = await Math.floor(100000 + Math.random() * 900000).toString()
      const hashOtp = await bcrypt.hash(OTP,10)
      const user = await userVerification.findOne({user:email})
      if(!user){
            const data = new userVerification({
            user:email,
            otp:hashOtp,
            created:Date.now(),
            Expiry:Date.now()+100000
        })
        await data.save()
      }else{
        await userVerification.updateOne({user:email},{otp:hashOtp})
      }
         let info
         if(link){
            const token = jwt.sign({ email,OTP }, process.env.JWT_SECRET, { expiresIn: 300000 })
              // send mail with defined transport object
               info = await transporter.sendMail({
               from: process.env.NODEMAILER, // sender address
               to: email, // list of receivers
               subject: "TalentF Password Reset Link", // Subject line
               text: `Hello User Your link to reset your password is  https://talentf.tk/#/changePass/${token} `, // plain text body
               })
            }else{
            // send mail with defined transport object
                info = await transporter.sendMail({
                from: process.env.NODEMAILER, // sender address
                to: email, // list of receivers
                subject: "One Time Password for TalentF", // Subject line
                text: `Hello User Your six digit OTP for authentication is ${OTP} `, // plain text body
                html: `<p>Hello User Your six digit OTP for authentication is <b>${OTP}</b></p>`, // html body
             })
         }
             if(info.messageId){
                res.status(200).json({status:true,message:'Otp send to mail'})
             }else{
                res.status(402).json('something went wrong')
             }


   } catch (error) {
    console.log(error,'send otp error');
    res.status(500).json(error)
   }
}

/* ------------------------------- RESEND OTP ------------------------------- */

const resendOtp =(req,res)=>{
   otpGenerate(req.body.email,res).then((response)=>{
   })
}


/* ---------------------------- OTP VERIFICATION ---------------------------- */

const verifyOtp = async (req, res) => {
   try {
    let validUser = await userVerification.findOne({user:req.body.email})
    let validOtp = await bcrypt.compare(req.body.otp,validUser.otp)

    if(validOtp){
      await validUser.updateOne({otp:'used'})
        res.status(200).json({message:'otp verified',auth:true})
    }else{
        res.status(403).json({message:'invalid Otp'})
    }
   } catch (error) {
    console.log(error,'verify otp error');
      res.status(500).json(error)
   }
}



/* --------------------------------- SIGNIN --------------------------------- */

const postSignIn = async (req, res) => {
   try {
      let { email, password } = req.body
      const user = await User.findOne({ email })
      if (user) {
         const pass = await bcrypt.compare(password, user.password)
         if (pass) {
            if (user.status === "active") {
               const id = user._id
               const { phone, email, password, followers, following, profilePic, ...details } = user._doc

               const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: 30000000 })
               res.status(200).json({ userToken: token, details, profilePic: profilePic, auth: true })
            } else {
               res.status(409).json({ message: "Your account is blocked" })
            }
         } else {
            res.status(401).json({ message: "Incorrect Password" })
         }
      } else {
         res.status(401).json({ message: "User not Found!" })
      }
   } catch (error) {
      res.json("Something went wrong!, Please try again.")
   }
}

/* ---------------------------- SHOW SUGGESTIONS ---------------------------- */

const getSuggestions = async (req, res) => {
   try {
      User.find({followers:{$nin:req.params.id},_id:{$ne:req.params.id}}).limit(5)  
         .then((response) => {
            res.status(200).json(response)
         })
         .catch((err) => {
            res.status(500).json("Something went wrong")
         })
   } catch (error) {
      res.status(500).json({ message: "Something went wrong!" })
   }
}

/* ------------------------------- FOLLOW USER ------------------------------ */

const putFollowUser = async (req, res) => {
   const details ={
      user:req.params.id,
      desc:'started following you',
      time:Date.now()
  }
   try {
      const user = await User.findById({ _id: req.params.id })
      const userToFollow = await User.findById({ _id: req.body.Id })
      if (!user.following.includes(req.body.Id)) {
         await user.updateOne({ $push: { following: req.body.Id } })
         await userToFollow.updateOne({ $push: { followers: req.params.id } })
         await NotificationModel.updateOne({userId:req.body.Id},{$push:{Notifications:details}})

         res.status(200).json("Followed")
      } else {
         res.status(403).json("You already follows this user")
      }
   } catch (error) {
      res.status(500).json({ message: "Something went wrong" })
   }
}

/* ------------------------------ UNFOLLOW USER ----------------------------- */

const putUnfollowUser = async (req, res) => {
   const details ={
      user:req.params.id,
      desc:'started following you',
  }
   try {
      const user = await User.findById({ _id: req.params.id })
      const userToUnfollow = await User.findById({ _id: req.body.Id })
      if (user.following.includes(req.body.Id)) {
         await user.updateOne({ $pull: { following: req.body.Id } })
         await userToUnfollow.updateOne({ $pull: { followers: req.params.id } })
         await NotificationModel.updateOne({userId:req.body.Id},{$pull:{Notifications:details}})
         res.status(200).json("UnFollowed")
      } else {
         res.status(403).json("You already unfollowed this user")
      }
   } catch (error) {
      res.status(500).json({ message: "Something went wrong" })
   }
}

/* ------------------------- GET USERDETAILS OF POST ------------------------ */

const getPostUser = async (req, res) => {
   const userId = req.query.userId
   try {
      const user = await User.findById(userId)

      const { password, created_date, status, ...others } = user._doc
      res.status(200).json(others)
   } catch (error) {
      res.status(500).json("Something went wrong!")
   }
}

/* ---------------------------- GET USER DETAILS BY Id---------------------------- */

const getUserDetails = async (req, res) => {
   const { userId } = req.params

   try {
      const user = await User.findById(userId)
      const { phone, password, ...details } = user._doc
      res.status(200).json(details)
   } catch (error) {
      res.status(500).json(error)
   }
}

/* --------------------- GET USER DETAILS WITH USERNAME --------------------- */

const getUserData = async (req, res) => {
   const username = req.query.username
   try {
      const user = await User.findOne({ userName: username })
      const { phone, password, ...details } = user._doc
      res.status(200).json(details)
   } catch (error) {
      console.log("error heree ")
      res.status(500).json(error)
   }
}

/* ---------------------------- GET MY FOLLOWERS ---------------------------- */

const getMyFollowers = async (req, res) => {

   try {
      const user = await User.findById(req.params.id)
      if (user) {
         const followers = await Promise.all(
            user?.followers?.map((id) => {
               return User.findOne({ _id: id }, { fullName: 1, userName: 1, profilePic: 1, accountType: 1 })
            })
         )
         res.status(200).json(followers)
      } else {
         res.status(402).json("Please try again")
      }
   } catch (error) {
      console.log(error)
      res.status(500).json(error)
   }
}

/* ---------------------------- GET MY FOLLOWING ---------------------------- */

const getMyFollowings = async (req, res) => {

   try {
      const user = await User.findById(req.params.id)
      if (user) {
         const following = await Promise.all(
            user?.following?.map((id) => {
               return User.findOne({ _id: id }, { fullName: 1, userName: 1, profilePic: 1, accountType: 1 })
            })
         )
         res.status(200).json(following)
      } else {
         res.status(402).json("Please try again")
      }
   } catch (error) {
      console.log(error)
      res.status(500).json(error)
   }
}

/* --------------------------- UPDATE USER PROFILE -------------------------- */

const updateUserProfile = async (req, res) => {
   const { fullName, userName, about, _id } = req.body
   try {
      const user = await User.find({ userName: userName })
      if (user.length === 0 || user._id === _id) {
         await User.findByIdAndUpdate(req.params.id, { $set: { fullName, userName, about } })
         res.status(200).json({ message: "profile updated successfully" })
      } else {
         res.status(409).json({ message: "userName not available!" })
      }
   } catch (error) {
      res.status(500).json(error)
   }
}
/* --------------------------- UPDATE PROFILE PIC --------------------------- */

const updateProfilePic = async (req, res) => {
   let image = req?.file?.filename
   const { userId } = req.body
   try {
      await User.findByIdAndUpdate(userId, { $set: { profilePic: image } })
      res.status(200).json({ image: image, message: "profile picture updated" })
   } catch (error) {
      res.status(500).json(error)
   }
}

/* ----------------------------- SEARCH FOR USER ---------------------------- */

const searchUsers = async (req, res) => {
   const data = req.params.id
   try {
      const users = await User.find(
         { userName: { $regex: "^" + data, $options: "i" } },
         { fullName: 1, userName: 1, profilePic: 1, accountType: 1 }
      )
      res.status(200).json(users)
   } catch (error) {
      console.log(error)
      res.status(500).json(error)
   }
}

/* ---------------------------- UPDATE COVER PIC ---------------------------- */

const updateCoverPic = async (req, res) => {
   let image = req?.file?.filename
   const { userId } = req.body
   try {
      await User.findByIdAndUpdate(userId, { $set: { coverPic: image } })
      res.status(200).json({ message: "profile picture updated" })
   } catch (error) {
      res.status(500).json(error)
   }
}

/* -------------------------- GET ALL NOTIFICATION -------------------------- */

const getNotifications = async (req, res) => {
   try {
      const notifications = await NotificationModel.findOne(
         { userId: req.params.id },
         { _id: 0, Notifications: 1 }
      ).sort({_id:-1}).populate("Notifications.user", "userName profilePic")
      const notification = notifications.Notifications.reverse()
      res.status(200).json(notification)
   } catch (error) {
      console.log(error)
      res.status(500).json(error)
   }
}

/* ------------------------ MANAGE NOTIFICATION STATUS ----------------------- */

const manageNotificationCount = async (req,res)=>{

   try {
      await NotificationModel.updateOne({userId:req.params.id},
         {$set:{'Notifications.$[].unRead':'false'}})
         res.status(200).json('updated')
   } catch (error) {
      console.log(error);
      res.status(500).json(error)
   }
}

/* ---------------------- GET UNREAD NOTIFICATION COUNT --------------------- */

const getNotifCount =async(req,res)=>{
   try {
      const result = await NotificationModel.findOne({userId:req.params.id})
      const unread =  result?.Notifications?.filter((data)=>{
         if(data?.unRead === 'true'){
            return data
         }
      })
      res.status(200).json(unread?.length)
   } catch (error) {
      res.status(500).json(error)
   }
}




/* -------------------------- CHANGE USER PASSWORD -------------------------- */

const changeUserPassword = async (req,res)=>{
   try {
    const user =  await User.findOne({_id:req.params.id})
    const valid = await bcrypt.compare(req.body.oldPass,user.password)
    if(valid){
      const hash = await bcrypt.hash(req.body.newPass,10)
      await user.updateOne({password:hash})
      res.status(200).json({message:'password updated Successfully'})
    }else{
      res.status(401).json({message:'current password is incorrect!'})
    }
   } catch (error) {
      console.log(error);
      res.status(500).json(error)
   }
}

/* ----------------------------- FORGOT PASSWORD ---------------------------- */

const forgotPassLinkSend =async (req,res)=>{
   const link = true;
   const user = await User.findOne({email:req.params.email})
   if(user){
      const data =await otpGenerate(req.params.email,res,link)
   }else{
      res.status(403).json({message:'User Details not found'})
   }
}

/* --------------------------- UPDATE NEW PASSWORD -------------------------- */

const updateNewPassword =async(req,res)=>{
   const {token,pass} = req.body
   try {     
      var decoded = jwt_decode(token);
      const user = await userVerification.findOne({user:decoded.email})
       if(user){
          const validUrl = await bcrypt.compare(decoded.OTP,user.otp)
         if(validUrl){
         const password =await bcrypt.hash(pass,10)
         await User.updateOne({email:decoded.email},{$set:{password:password}})
         await user.updateOne({otp:'used'})
         res.status(200).json({message:'Password updated Successfully'})
         }else{
          res.status(403).json({message:'Authentication Failed'})
         }
       }
   } catch (error) {
      res.status(500).json(error)
   }
}


module.exports = {
   postCreateAccount,
   postSignIn,
   getSuggestions,
   putFollowUser,
   getPostUser,
   updateProfilePic,
   putUnfollowUser,
   getUserDetails,
   getUserData,
   getMyFollowers,
   getMyFollowings,
   updateUserProfile,
   searchUsers,
   updateCoverPic,
   getNotifications,
   verifyOtp,
   sendUserOtp,
   resendOtp,
   changeUserPassword,
   manageNotificationCount,
   getNotifCount,
   forgotPassLinkSend,
   updateNewPassword
}
