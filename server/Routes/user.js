const express = require('express')
const router = express.Router()
const upload = require('../config/multerConfig')
const verifyJWT = require('../Middlewares/verifyJWT')


//************* */ USER CONTROLLER 
const {postCreateAccount, postSignIn, getSuggestions,putFollowUser, getPostUser,
       putUnfollowUser,getUserDetails,getUserData,getMyFollowers,getMyFollowings,
       updateUserProfile,updateProfilePic,searchUsers,updateCoverPic,getNotifications,
       verifyOtp,sendUserOtp,resendOtp,changeUserPassword,manageNotificationCount,
       getNotifCount,forgotPassLinkSend,updateNewPassword} = require('../Controller/userController')

//************** */ POST CONTROLLER 
const {postUpload,getTimelinePost,putLikePost,putPostComment,getViewComments,
       getUserPosts,deletePost,reportPost,getReportData,getPostArchieves} = require('../Controller/postController')


/* --------------------------------- ROUTES ------------------------------------ */

router.post('/create_account',postCreateAccount)


router.post('/signin',postSignIn)


router.post('/uploadPost',upload.single('file'),postUpload)


router.get('/post/timeline_post/:id',verifyJWT,getTimelinePost)


router.get('/postDetails/:id',verifyJWT,getPostUser)


router.get('/suggestions/:id',verifyJWT,getSuggestions)


router.put('/:id/follow',verifyJWT,putFollowUser)

router.put('/:id/unfollow',verifyJWT,putUnfollowUser)


router.put('/post/like/:id',verifyJWT,putLikePost)


router.put('/post/comment/:id',verifyJWT,putPostComment)


router.get('/post/viewComments/:id',verifyJWT,getViewComments)

router.get('/profile/myposts/:id',verifyJWT,getUserPosts)

router.get('/profile/myposts/archieves/:id',verifyJWT,getPostArchieves)


router.get('/users/:userId',verifyJWT,getUserDetails)


router.get('/:id',verifyJWT,getUserData)

router.delete('/post/delete/:id',verifyJWT,deletePost)


router.put('/post/report/:id',verifyJWT,reportPost)

router.get('/user/myFollowers/:id',verifyJWT,getMyFollowers)


router.get('/user/myFollowing/:id',verifyJWT,getMyFollowings)


router.get('/admin/post/reportDetails/:id',verifyJWT,getReportData)


router.put('/user/updateProfile/:id',verifyJWT,updateUserProfile)


router.put('/user/update/profilePic',upload.single('file'),updateProfilePic)


router.get('/user/search/:id',verifyJWT,searchUsers)


router.put(`/user/update/coverPic`,upload.single('file'),updateCoverPic)


router.get('/user/notification/:id',verifyJWT,getNotifications)

router.post('/signup/sendOtp',sendUserOtp)

router.post('/signup/otp/resend',resendOtp)

router.post('/singnUp/otp/verify',verifyOtp)

router.put('/user/editProfile/changePassword/:id',verifyJWT,changeUserPassword)

router.put('/user/notification/read/:id',verifyJWT,manageNotificationCount)

router.get('/user/notifications/getCount/:id',verifyJWT,getNotifCount)

router.put('/forgotPassword/:email',forgotPassLinkSend)

router.put('/resetPassword',updateNewPassword)

module.exports = router