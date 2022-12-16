const mongoose = require('mongoose')


const Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

const jobReportSchema = mongoose.Schema({
    workId:{
        type:String,
        required:[true,'workId is required']
    },
    userId:{
        type:String,
        required:[true,'userId is missing'],
        ref:'users'
    },
    reason:{
        type:String,
        required:[true,'Provide a reason for reporting the post']
    }

},{timestamps:true})

const JobReport = mongoose.model('jobReports',jobReportSchema);
module.exports = JobReport;