
import axios from '../Axios/axios'

import userInstance from '../Axios/userAuth'

export const getUser = (userId) => userInstance.get(`/users/${userId}`)


export const getUserByUsername = (username) =>userInstance.get(`/users?username=${username}`)


export const getUserFollowers = (userId) => userInstance.get(`/user/myFollowers/${userId}`)


export const getUserFollowing = (userId) => userInstance.get(`/user/myFollowing/${userId}`)


export const updateUserProfile = (userId,data) => userInstance.put(`/user/updateProfile/${userId}`,data)


export const setProfilePicture = (data) => axios.put(`/user/update/profilePic`,data)


export const findSearch = (data)=> userInstance.get(`/user/search/${data}`)


export const updateCoverPic = (data)=> axios.put(`/user/update/coverPic`,data)


export const getAllNotifications = (userId) => userInstance.get(`/user/notification/${userId}`)


export const sendOtp = (data) =>axios.post(`/signup/sendOtp`,data)


export const validateOtp = (otp) => axios.post(`/singnUp/otp/verify`,otp)

export const resendOtpCall = (data)=>axios.post(`/signup/otp/resend`,{email:data})


export const changePassword =(userId,data) =>userInstance.put(`/user/editProfile/changePassword/${userId}`,data)


export const handleNotCount = (userId) => userInstance.put(`/user/notification/read/${userId}`)


export const fetchNoCounts = (userId) => userInstance.get(`/user/notifications/getCount/${userId}`)

export const forgotPass = (email)=>axios.put(`/forgotPassword/${email}`)


export const updateNewPass =(pass,email,otp)=>axios.put(`/resetPassword`,{pass,email,otp})
