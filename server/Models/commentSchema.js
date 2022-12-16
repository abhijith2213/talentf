const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    postId:{
        type:String,
        required:[true]
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        reqired:[true]
    },
    comment:{
        type:String,
        required:[true]
    },

},{timestamps:true})


const Comment = mongoose.model('comments',commentSchema);
module.exports = Comment