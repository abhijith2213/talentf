const Post = require('../Models/postSchema');
const Comment = require('../Models/commentSchema')
const User = require('../Models/userSchema');
const Report = require('../Models/reportsSchema');
const NotificationModel = require('../Models/notificationSchema');
const { findById } = require('../Models/userSchema');

const multer = require('multer')
const upload = require('../config/multerConfig')


/* ------------------------------  UPLOAD NEW POST------------------------------ */

const postUpload=(req,res)=>{

    try {      
            let{userId,description}= req.body
            let image = req?.file?.filename
            console.log(image,'mmmmmmmmok');
            Post.create({userId,description,image}).then((response)=>{
                res.status(200).json({message:'Post added successfully'})
            }).catch((err)=>{
                console.log(err,'ooooerrorr');
                res.status(500).json({message:'Post Add failed'})
            })
    } catch (error) {
        console.log(error.message,'eeeeeerrrrrott');
        res.status(500).json({message:'invalid image'})
    }

    
}

/* -------------------------------- GET TIMELINE POSTS ------------------------------- */

const getTimelinePost =async (req,res)=>{
    try {
        const user = await User.findById(req.params.id)
        const myPost = await Post.find({userId:req.params.id,status:'active'}).sort({createdAt:-1})
        const feedPosts = await Promise.all(user.following.map((id)=>{
        return Post.find({userId:id,status:'active',reports:{$ne:req.params.id}}).sort({createdAt:-1})
        })
      )
        console.log(feedPosts);
      res.status(200).json(myPost.concat(...feedPosts))
    } catch (error) {
        console.log(error);
        res.status(500).json('Something went wrong!')
    }
}



/* -------------------------- POST LIKE MANAGEMENT -------------------------- */

const putLikePost = async (req,res)=>{
    const details ={
        user:req.body.userId,
        desc:'Liked your post',
        time:Date.now()
    }
    try {
        const post = await Post.findById(req.params.id)
        if(!post?.likes?.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}})
            if(post.userId !== req.body.userId){
                await NotificationModel.updateOne({userId:post.userId},{$push:{Notifications:details}})
            }
            res.status(200).json({message:'post Liked'})
        }else{
            await post.updateOne({$pull:{likes:req.body.userId}})
            await NotificationModel.updateOne({userId:post.userId},{$pull:{Notifications:details}})
            res.status(200).json({message:'post disliked!'})
        }
    } catch (error) {
        console.log(error,'ooooo');
        res.status(500).json(error)
    }

}

/* ------------------------- POST COMMENT MANAGEMENT ------------------------ */

const putPostComment = async (req,res)=>{
    console.log('reached comment');
    console.log(req.body,'body');
    console.log(req.params.id,'params id');
    const {userId,comment,postUser} = req.body
    const postId = req.params.id
    const details ={
        user:userId,
        desc:'Commented your post',
        time:Date.now()
    }
    try {
        await  Comment.create({userId,comment,postId:postId})
        await NotificationModel.updateOne({userId:postUser},{$push:{Notifications:details}})
          console.log(res,'opl');
          res.status(200).json({message:'comment added successfully'})
    } catch (error) {
        console.log(error.message,'error message comment');
        res.status(500).json({message:"Something went wrong"})
    }
}

/* --------------------------- VIEW POST COMMENTS --------------------------- */

const getViewComments = async(req,res)=>{

    try {        
        let comments =await Comment.find({postId:req.params.id}).populate('userId','userName')
        res.status(200).json(comments)

    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:'Something went wrong'})
    }
}

/* ------------------------- VIEW USER POSTS PROFILE ------------------------ */

const getUserPosts = async (req,res)=>{
console.log(req.params.id,'opidd post');
    try {
      let posts = await Post.find({userId:req.params.id,status:'active'}).sort({createdAt:-1})
      res.status(200).json(posts)
    } catch (error) {
        res.status(500).json(error)
    }
}

/* ----------------------- VIEW ARCHIEVE BLOCKED POST ----------------------- */

const getPostArchieves =async (req,res)=>{
    console.log(req.params.id,'archieve opidd post');
    try {
      let posts = await Post.find({userId:req.params.id,status:'inactive'}).sort({createdAt:-1})
      res.status(200).json(posts)
    } catch (error) {
        res.status(500).json(error)
    }
}


/* ---------------------------- Delete User Post ---------------------------- */

const deletePost = async (req,res)=>{
    try {
        let result1 =await Post.findByIdAndDelete(req.params.id)
        let result2 = await Comment.deleteMany({postId:req.params.id})
        res.status(200).json({message:'Post deleted successfully'})
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}

/* ----------------------------- Report USER POST ---------------------------- */


const reportPost=async(req,res)=>{
    console.log('eeeeeevvvvvvvvvvvvvvvvv');
    const postId = req.params.id;
    const {userId,reason} = req.body
    const data = new Report({postId:postId,userId:userId,reason:reason})
    console.log(data,'save dataaaa');

    try {
       let post = await Post.findById(postId)
       if(!post?.reports?.includes(userId)){
        console.log('in');
       await post.updateOne({$push:{reports:userId}}) 
       await data.save()
       }
       res.status(200).json({message:'post Reported Successfully!'})
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}


/* --------------------------- GET REPORTED POSTS --------------------------- */

const getReportedPosts = async (req,res)=>{
    console.log('in report post find');

    try {
        const posts =await Post.find()
        console.log(posts,'allposts');
      const result =  posts.filter((post)=>{
            if(post?.reports?.length != 0)
            return(post)
        })
        console.log(result,'filterallposts');
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
}

/* ------------------------------- BLOCK POST ------------------------------- */

const blockPost =async (req,res)=>{
    console.log(req.params.id,'pojhgfdfg');
    try {
        const post = await findById(req.params.id)
        post.updateOne({$set:{status:'inactive'}})
        const details ={
            user:post.userId,
            desc:'Post has been Blocked',
            time:Date.now()
        }    
            await NotificationModel.updateOne({userId:post.userId},{$push:{Notifications:details}})
            res.status(200).json({message:'post Blocked!'})
    } catch (error) {
        res.status(500).json(error)
    }
}


/* ------------------------------- UnBLOCK POST ------------------------------- */

const unBlockPost =async (req,res)=>{
    console.log(req.params.id,'pojhgfdfg');

    try {
        const result = await Post.findByIdAndUpdate(req.params.id,
            {
                $set:{status:'active'}
            })
            res.status(200).json({message:'post Unblocked!'})
    } catch (error) {
        res.status(500).json(error)
    }
}


/* -------------------------- GET POST REPORT DATA -------------------------- */

const getReportData = async(req,res)=>{
    console.log(req.params.id,'params report data');

    try {
       const result = await Report.find({postId:req.params.id}).populate('userId','userName')
       res.status(200).json(result)
       console.log(result,'ijnb');
    } catch (error) {
        res.status(500).json(error)
    }
}




module.exports = {postUpload,getTimelinePost,putLikePost,putPostComment,getViewComments,getPostArchieves,
                  getUserPosts,deletePost,reportPost,getReportedPosts,blockPost,unBlockPost,getReportData}
