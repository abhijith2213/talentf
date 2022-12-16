const JobReport = require("../Models/jobReportSchema");
const Job = require("../Models/jobSchema");
const NotificationModel = require("../Models/notificationSchema");
const User = require("../Models/userSchema");
/* ------------------------------ ADD NEW WORK ------------------------------ */

const PostAddWork = async (req,res)=>{
    console.log(req.body,'fghjk');
    console.log('reached works');
    const {data,userId} = req.body
    console.log(data,userId,'lllllll');
    const datas = new Job({...data,userId:userId})
    try {
        await datas.save()
        res.status(200).json({message:'New Job added'})
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}

/* ------------------------------ GET OWN WORKS ----------------------------- */

const getMyPosts = async (req,res)=>{
    console.log(req.params.id);
    try {
       const posts = await Job.find({userId:req.params.id,work:'open'})
       res.status(200).json(posts)
    } catch (error) {
        res.json(500).json(error)
    }
}

/* --------------------------- GET ASSIGNED POSTS --------------------------- */

const getAssignedPosts = async (req,res)=>{

    try {
        const posts = await Job.find({userId:req.params.id,work:{$ne:'open'}}).populate('work','userName')
        res.status(200).json(posts)
    } catch (error) {
        res.json(500).json(error)
    }
}
/* --------------------------- GET TIMELINE WORKS --------------------------- */

const getAllPosts = async (req,res)=>{
    console.log(req.params.id);
    let ab=[]
    try {
        const user = await User.findById(req.params.id)
        const posts = await Promise.all(user?.following?.map((id)=>{
            return  Job.find({userId:id,work:'open',status:'active',reports:{$ne:req.params.id}}).sort({createdAt:-1}).populate('userId','userName fullName')
           
        }))
        const result = posts?.filter((post)=>{
            return post.length != 0
        })
        console.log(ab.concat(...result),'nnnpostsss');
        res.status(200).json(ab.concat(...result))
    } catch (error) {
       console.log(error);
       res.status(500).json(error) 
    }
}

/* ------------------------------ DELETE WORKS ------------------------------ */

const deleteJob = async (req,res)=>{
try {
    await Job.findByIdAndDelete(req.params.id)
    res.status(200).json({message:'Job Removed!'})
} catch (error) {
    res.json(500).json(error)
}
}

/* ---------------------------- SEND JOB REQUESTS --------------------------- */

const sendJobRequest = async (req,res)=>{
    console.log(req.params.id);
    console.log(req.body);
    const details ={
        user:req.body.userId,
        desc:'Send a Connect Request'
    }
    try {
        const job = await Job.findByIdAndUpdate(req.params.id,
            {$push:{requests:req.body.userId}})
            await NotificationModel.updateOne({userId:job.userId},{$push:{Notifications:details}})
            console.log(job,'oo');
            res.status(200).json({message:'Request Send Successfully'})

    } catch (error) {
        console.log(error);
       res.status(500).json(error) 
    }
}

/* ----------------------------- FETCH REQUESTED WORKS ----------------------------- */

const getRequests = async (req,res)=>{
    console.log(req.params.id);
    try {
       const jobs = await Job.find({userId:req.params.id,requests:{$exists:true,$ne:[]}})
       console.log(jobs,'mko');
       res.status(200).json(jobs)
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}

/* ------------------------ FETCH REQUESTED USERDATA ----------------------- */

const getRequestUsers =async(req,res)=>{
    console.log(req.params.id);
    try {
        const data = await Job.findById(req.params.id).populate('requests','userName fullName profilePic')
        res.status(200).json(data.requests)
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}

/* --------------------------- ASSIGN WORK TO USER -------------------------- */

const assignWork =async (req,res)=>{
    const {userId} = req.body;
    console.log(userId,'lll');
    console.log(req.params.id);
    
    try {
        const job =  await Job.findByIdAndUpdate(req.params.id,
            {$set:{work:userId,requests:[]}})
            console.log(job,'asign work job hehe');

           const details ={
           user:job.userId,
            desc:' Assigned New work to you',
            time:Date.now()
            }
            
            await NotificationModel.updateOne({userId:userId},{$push:{Notifications:details}})
            res.status(200).json({message:'Work assigned Successfully'})
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
        
    }
}

/* ------------------------------- REPORT JOBS ------------------------------ */

const reportJob = async (req,res)=>{
    const workId = req.params.id;
    const {userId,reason} = req.body
    const data = new JobReport({workId,userId,reason})
    console.log(data,'save dataaaa');

    try {
        let job = await Job.findById(workId)
        if(!job?.reports?.includes(userId)){
         console.log('in');
        await job.updateOne({$push:{reports:userId}}) 
        await data.save()
        }
        res.status(200).json({message:'post Reported Successfully!'})
     } catch (error) {
         console.log(error);
         res.status(500).json(error)
     }
}

/* --------------------------- FETCH REPORTED JOBS -------------------------- */

const fetchReportedJobs = async (req,res)=>{
    console.log('heeerererererrere');
    try {
        const posts =await Job.find({reports:{$exists:true,$ne:[]}}).populate('userId','userName')
        console.log(posts,'allposts');
        res.status(200).json(posts) 
    } catch (error) {
        res.status(500).json(error)
    }
}

/* ------------------------ FETCH REPORTED JOB DATAS ------------------------ */

const ReportedJobDetails = async (req,res)=>{
    console.log(req.params.id);
    try {
        const result = await JobReport.find({workId:req.params.id}).populate('userId','userName')
        res.status(200).json(result)
        console.log(result,'ijnnnnnnb');
     } catch (error) {
         res.status(500).json(error)
     }
}

/* ------------------------------- BLOCK JOBS ------------------------------- */

const blockJOb =async(req,res)=>{

    try {
        const result = await Job.findByIdAndUpdate(req.params.id,
            {
                $set:{status:'inactive'}
            })
            res.status(200).json({message:'post Blocked!'})
    } catch (error) {
        res.status(500).json(error)
    }
}

/* -------------------------- GET MY ASSIGNED WORKS ------------------------- */

const assignedWorksToMe = async(req,res)=>{

    try {
        const work = await Job.find({work:req.params.id}).populate('userId', 'userName fullName profilePic')
        console.log(work,'pllllwork');
        res.status(200).json(work)
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = {PostAddWork, getMyPosts,getAssignedPosts,getAllPosts,deleteJob,sendJobRequest,getRequests,
                  getRequestUsers,assignWork,reportJob,fetchReportedJobs,ReportedJobDetails,blockJOb,assignedWorksToMe}