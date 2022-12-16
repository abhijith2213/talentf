const express = require('express')
const router = express.Router()


const {postAdminLogin, getUserManagement, blockUser, unblockUser} = require('../Controller/adminController')
const { fetchReportedJobs,ReportedJobDetails ,blockJOb} = require('../Controller/jobController')
const {getReportedPosts,blockPost,unBlockPost} = require('../Controller/postController')
const verifyJWT = require('../Middlewares/verifyJWT')


router.post('/admin_login',postAdminLogin)


router.get('/user_management',verifyJWT, getUserManagement)


router.put('/user_management/block_user',blockUser)

router.put('/user_management/unblock_user',unblockUser)

router.get('/posts/reportedPosts',getReportedPosts)

router.put('/post/block/:id',blockPost)


router.put('/post/unblock/:id',unBlockPost)

router.get(`/reportedWorks`,fetchReportedJobs)

router.get(`/reportedJobs/details/:id`,ReportedJobDetails)


router.put('/jobs/block/:id',blockJOb)

module.exports = router