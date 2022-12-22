const express = require('express')
const router = express.Router()


const {postAdminLogin, getUserManagement, blockUser, unblockUser} = require('../Controller/adminController')
const { fetchReportedJobs,ReportedJobDetails ,blockJOb} = require('../Controller/jobController')
const {getReportedPosts,blockPost,unBlockPost} = require('../Controller/postController')
const verifyJWT = require('../Middlewares/verifyJWT')


router.post('/admin_login',postAdminLogin)


router.get('/user_management',verifyJWT, getUserManagement)


router.put('/user_management/block_user',verifyJWT,blockUser)

router.put('/user_management/unblock_user',verifyJWT,unblockUser)

router.get('/posts/reportedPosts',verifyJWT,getReportedPosts)

router.put('/post/block/:id',verifyJWT,blockPost)


router.put('/post/unblock/:id',verifyJWT,unBlockPost)

router.get(`/reportedWorks`,verifyJWT,fetchReportedJobs)

router.get(`/reportedJobs/details/:id`,verifyJWT,ReportedJobDetails)


router.put('/jobs/block/:id',verifyJWT,blockJOb)

module.exports = router