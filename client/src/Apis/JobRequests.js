import userInstance from '../Axios/userAuth'
import adminInstance from '../Axios/adminAuth'

export const addNewJob =(data,userId) =>userInstance.post(`/works/newWork`,{data:data,userId:userId})

export const findMyPosts = (userId) => userInstance.get(`/works/myPosts/${userId}`)

export const findAssignedPosts = (userId) => userInstance.get(`/works/assignedPosts/${userId}`)

export const findAllPosts = (userId) => userInstance.get(`/works/allPosts/${userId}`)

export const deleteJob = (postId) => userInstance.delete(`/works/delete/${postId}`)

export const sendConnect = (userId,postId) => userInstance.put(`/works/sendRequest/${postId}`,{userId:userId})

export const fetchJobRequests = (userId) => userInstance.get(`/works/requests/${userId}`)

export const getRequestUsers = (postId) => userInstance.get(`/works/requestDetails/${postId}`)

export const assignWork = (userId,workId) => userInstance.put(`/works/assignWork/${workId}`,{userId:userId})

export const findWorksToMe = (userId) => userInstance.get(`/works/assigneWorks/me/${userId}`)

export const reportJobPost = (reason,postId,userId) => adminInstance.put(`/works/reportWork/${postId}`,{reason:reason,userId:userId})

export const fetchReportedJobss = ()=> adminInstance.get(`/admin/reportedWorks`)


export const fetchReportedJobDetails = (jobId)=> adminInstance.get(`/admin/reportedJobs/details/${jobId}`)

export const blockUserJob = (jobId) => adminInstance.put(`/admin/jobs/block/${jobId}`)