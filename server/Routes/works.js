const express = require('express')
const router = express.Router()
const {PostAddWork,getMyPosts,getAssignedPosts,getAllPosts, deleteJob, sendJobRequest,
        getRequests ,getRequestUsers,assignWork ,reportJob, assignedWorksToMe  } = require('../Controller/jobController')
const verifyJWT = require('../Middlewares/verifyJWT')

router.post('/newWork',verifyJWT,PostAddWork)

router.get('/myPosts/:id',verifyJWT,getMyPosts)

router.get('/assignedPosts/:id',verifyJWT,getAssignedPosts)

router.get('/allPosts/:id',verifyJWT,getAllPosts)

router.delete('/delete/:id',verifyJWT,deleteJob)

router.put('/sendRequest/:id',verifyJWT,sendJobRequest)

router.get('/requests/:id',verifyJWT,getRequests)


router.get('/requestDetails/:id',verifyJWT,getRequestUsers)


router.put('/assignWork/:id',verifyJWT,assignWork)

router.get('/assigneWorks/me/:id',verifyJWT,assignedWorksToMe)

router.put('/reportWork/:id',verifyJWT,reportJob)

 
module.exports= router