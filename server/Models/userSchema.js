const mongoose = require('mongoose')


const validateEmail = function(email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const userSchema = mongoose.Schema({
    fullName:{
        type:String,
        required:[true,"Name is required"]
    },
    userName:{
        type:String,
        required:[true,'Username is required'],
        unique:true
    },
    about:{
        type:String
    },
    email:{
        type:String,
        validate:[validateEmail,'please add a valid email'],
        required:[true,'email is required'],
        unique:true
    },
    phone:{
        type:Number,
        required:[true,'phone is required'],
        minlength:[10,'Enter a valid number'],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        max:[12,'password cannot exceed 15 letters'],
        min:[6,"Password must contain atleast 6 letters"],
    },
    accountType:{
        type:String,
        required:[true,'Account Type must be selected']
    },
    created_date:{
        type:Date,
        default: Date.now()
    },
    status:{
        type:String,
        default:"active"
    },
    profilePic:{
        type:String,
        default:'download.png'
    },
    coverPic:{
        type:String,
        default :'defaultCover.png'
    },
    followers:{
        type:Array,
        default:[]
    },
    following:{
        type:Array,
        default:[]
    }
})

const User = mongoose.model('users',userSchema);
module.exports = User;