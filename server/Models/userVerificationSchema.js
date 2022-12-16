const mongoose = require ('mongoose')

const userVerificationSchema  = new mongoose.Schema({
    user:String,
    otp:String,
    Created:Date,
    Expiry:Date
})

const userVerification = mongoose.model('userVerification',userVerificationSchema)
module.exports = userVerification