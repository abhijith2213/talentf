import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import moment from "moment"
import { Link } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify" //Toast
import "react-toastify/dist/ReactToastify.css" //Toast Css

// ASSETS
import { RiCheckboxCircleLine } from "react-icons/ri"
import { MdOutlineWork, MdOutlineArrowDropDownCircle } from "react-icons/md"

// API CALLS 

import { assignWork, fetchJobRequests, getRequestUsers } from "../../../../Apis/JobRequests"




function JobRequests() {

   const PF = process.env.REACT_APP_PUBLIC_FOLDER

const userData = useSelector((state) => state.user)
const userId = userData?._id


   const [showRequests, setShowRequests] = useState(false)
   const [effect,setEffect] = useState(false)


   /* -------------------------- FETCH MY JOB REQUESTS ------------------------- */
   const [requests,setRequests] = useState([])
   console.log(requests,'req');
   useEffect(()=>{

      try {
         const fetchRequests=async()=>{
          const {data} = await fetchJobRequests(userId) 
          console.log(data,'reqjobdata');
          setRequests(data)
         }
         fetchRequests()
      } catch (error) {
         console.log(error);
      }
   },[effect])

   /* -------------------------- FETCH REQUESTED USERS ------------------------- */
   const [clickedWork,setClickedWork] = useState('')
   const [users,setUsers] = useState([])

   const handleShowRequesters = async(postId)=>{ 
      setClickedWork(postId)  
      try {
         const {data} = await getRequestUsers(postId)
         console.log(data,'xxxxxccccccc');
         setUsers(data)
         setShowRequests(!showRequests)
       } catch (error) {
         console.log(error);
       }
   }

   /* --------------------------- ASSIGN WORK TO USER -------------------------- */

   const handleAssignWork = async(Id)=>{

      try {
         const {data} = await assignWork(Id,clickedWork)
         console.log(data);
         setEffect(!effect)
         setShowRequests(!showRequests)
         toast.success(data.message) 
      } catch (error) {
         console.log(error);
      }
   }

   return (

    <>
      {userData.accountType === 'client' ?
      <div className='bg-white m-12 shadow-md rounded-md p-8 fixed right-0 top-0 hidden lg:block'>
         <p className='mb-6 font-medium text-blue-700'>Work Requests</p>
         {requests?.length != 0 ? requests?.map((req)=>{
         let date = moment(req?.createdAt).format("YYYY-MM-DD")
         return(
            
         <div
            className='flex justify-between items-center mb-5 gap-11 cursor-pointer'
            onClick={()=>handleShowRequesters(req._id)}>
            <div className='flex items-center'>
               <MdOutlineWork className='text-xl' />
               <div className='flex flex-col justify-center ml-3'>
                  <p className=' text-sm'>Job :<span className="font-medium ml-2">{req?.jobRole}</span></p>
                  <p className=' text-sm'>Posted On: <span className="font-medium ml-2">{date}</span> </p>
               </div>
            </div>
            <MdOutlineArrowDropDownCircle className='text-lg' />
         </div>
         )}): 
         <div className='flex justify-between items-center mb-5 gap-11 cursor-pointer'>
         <p className="text-gray-400">No work Requests to show!</p>
       </div>}
         {/* DROP DOwN  */}
         <hr />
         {showRequests && 
         <>
         {users?.length != 0 ? users?.map((user)=>{
            return(            
            <div className="max-h-32 overflow-y-auto no-scrollbar">
            <div className='flex justify-between items-center gap-3 m-2 '>
            <Link to={`/profile/${user?.userName}`}>
               <div className='flex items-center'>
                  <img className='rounded-full w-10 h-10 ' src={PF+user?.profilePic} alt='pic' />
                  <div className='flex flex-col justify-center ml-3'>
                     <p className=' text-sm'>{user?.fullName}</p>
                     <p className=' text-xs'>@{user?.userName}</p>
                  </div>
               </div>
               </Link>
               <div className='flex gap-2'>
                  <button
                     type='button'
                     onClick={()=>handleAssignWork(user._id)}
                     className='text-green-500 flex justify-center  focus:outline-none  font-medium rounded-lg text-2xl  text-center' >
                     <RiCheckboxCircleLine />
                  </button>
               </div>
            </div>
         </div>
            )
         }):
         <div className='flex justify-between items-center mb-5 gap-11 cursor-pointer'>
            <p className="text-gray-400">No Requests for this job</p>
          </div>
          }
         </>
         }
         <hr />
      </div>
      : null}
      <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable
      pauseOnHover
      theme="dark"/>
    </>
   )
}

export default JobRequests
