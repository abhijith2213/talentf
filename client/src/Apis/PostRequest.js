import adminInstance from '../Axios/adminAuth'
import axios from '../Axios/axios'


export const deleteUserPost = (postId) => axios.delete(`/post/delete/${postId}`)


export const reportUserPost = (reason,postId,userId) => axios.put(`/post/report/${postId}`,{userId:userId,reason:reason})


export const fetchReportedPosts = () => adminInstance.get(`/posts/reportedPosts`)


export const blockUserPost =(postId)=> adminInstance.put(`/post/block/${postId}`)


export const unblockUserPost = (postId) => adminInstance.put(`/post/unblock/${postId}`)


export const getReportDetails = (postId) => axios.get(`/admin/post/reportDetails/${postId}`)