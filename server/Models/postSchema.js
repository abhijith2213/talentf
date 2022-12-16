const mongoose = require('mongoose');



const Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

const postSchema = mongoose.Schema({
    userId:{
        type: ObjectId,
        required:[true,'User Id not found']
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    status:{
        type:String,
        default:'active'
    },
    likes:{
        type:Array,
        default:[]
    },
    reports:{
        type:Array,
        default:[]
    }

    
},{timestamps:true})

const Post = mongoose.model('posts',postSchema);
module.exports = Post