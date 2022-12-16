const mongoose = require('mongoose')


const Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

const reportSchema = mongoose.Schema({
    postId:{
        type:String,
        required:[true,'postId is required']
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

const Report = mongoose.model('reports',reportSchema);
module.exports = Report;