const mongoose = require('mongoose')

const jobSchema = mongoose.Schema({
    userId:{
        type:String,
        required:true,
        ref:"users"
    },
    jobRole:{
        type:String,
        required:true
    },
    workPeriod:{
        type:String,
        required:true
    },
    workType:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:'active'
    },
    work:{
        type:String,
        ref:'users',
        default:'open' 
    },
    requests:{
        type:Array,
        ref:'users',
        default:[]
    },
    reports:{
        type:Array,
        default:[]
    }
},{timestamps:true})

const Job = mongoose.model('works',jobSchema);
module.exports = Job