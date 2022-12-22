import React, { useState } from "react"
import { useSelector } from "react-redux"
import { format } from "timeago.js"
import { Link,useNavigate } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify" //Toast
import "react-toastify/dist/ReactToastify.css" //Toast Css

// Assets
import { BsThreeDotsVertical } from "react-icons/bs"
import { deleteJob } from "../../../Apis/JobRequests"
import { useErrorHandler } from "react-error-boundary"

function Client({ job, setEffect }) {

   const PF = process.env.REACT_APP_PUBLIC_FOLDER
   const handleError = useErrorHandler()
   const navigate = useNavigate()
   const userData = useSelector((state) => state.user)
   const userId = userData._id
   const [options, setOptions] = useState(false)

   const [deleteModal,setdeleteModal] = useState(false)

   /* ------------------------------ HANDLE DELETE ----------------------------- */

   const handleDelete = async () => {
      try {
         const { data } = await deleteJob(job._id)
         toast.warn(data.message)
         setEffect(Date.now())
      } catch (error) {
         if (!error?.response?.data?.auth && error?.response?.status === 403) {
            localStorage.removeItem('userToken')
            localStorage.removeItem('user')
            navigate("/signin")
         }else{
            handleError(error)
         }
      }
   }

 


   return (
      <>
         <div className='flex pt-8 justify-center'>
            <div className=' w-screen flex justify-center'>
               <div className='bg-[#FFFFFF] w-[470px] rounded-lg shadow-md border mb-4'>
                  <div className='flex justify-between items-center'>
                     {/* NAME AND PROFILE PIC  */}
                     <div className='h-16  flex items-center'>
                        <img
                           className=' rounded-full w-10 mx-3'
                           src={ PF + userData.profilePic }
                           alt='profile-pic'
                        />
                        <div className='pr-4 '>
                           <p className='font-medium text-sm '>{userData?.fullName}</p>
                           <div className='flex gap-4 items-center'>
                              <p className='text-xs'>@{userData?.userName}</p>
                           </div>
                        </div>
                     </div>

                     <div className='pr-3 relative'>
                        <div>
                           <span onClick={() => setOptions(!options)} className='cursor-pointer'>
                              <BsThreeDotsVertical />
                           </span>
                           {options && job.work === "open" ? (
                              <ul
                                 className='cursor-pointer dropdown-menu min-w-max absolute right-0 bg-white text-base z-50 float-left py-2 list-none
                                      text-left rounded-lg shadow-lg mt-1 m-0 bg-clip-padding border-none'
                              >
                                 <li>
                                    <span
                                       onClick={()=>setdeleteModal(true)}
                                       className='dropdown-item text-sm py-2 px-4 font-normal block w-full whitespace-nowrap
                                              bg-transparent text-gray-700 hover:bg-gray-100'
                                    >
                                       Delete
                                    </span>
                                 </li>
                                 <li>
                                    <span
                                       className='dropdown-item text-sm py-2 px-4 font-normal block w-full whitespace-nowrap
                                            bg-transparent text-gray-700 hover:bg-gray-100'
                                       onClick={() => setOptions(false)}
                                    >
                                       cancel
                                    </span>
                                 </li>
                              </ul>
                           ) : null}
                        </div>
                     </div>

                     {/* SIDE DOT END  */}
                  </div>
                  <div className='flex flex-col p-6'>
                     <div className='flex flex-col gap-2 mb-2 mx-3'>
                        <div className='flex gap-2 items-center'>
                           <p className='font-medium'>Job Role :</p>
                           <span className='text-sm'>{job?.jobRole}</span>
                        </div>

                        <div className='flex gap-2 items-center'>
                           <p className='font-medium'>Work Type :</p>
                           <span className='text-sm'>{job?.workType}</span>
                        </div>
                        <div className='flex gap-2 items-center'>
                           <p className='font-medium'>Work Period :</p>
                           <span className='text-sm'>{job?.workPeriod}</span>
                        </div>
                        <div className='flex gap-2 '>
                           <p className='font-medium'>Description:</p>
                           <span className='text-sm mt-1'>{job?.description}</span>
                        </div>
                     </div>
                  </div>

                  <div className='flex flex-col'>
                     {/* LIKE AND COMMENT  */}
                     <div className='flex justify-center'>
                        <div className='flex justify-between w-3/4 m-4'>
                           <div className='flex items-center gap-1'>
                              <p className='text-green-600 text-sm font-medium'>{format(job?.createdAt)}</p>
                           </div>
                           <Link to={`/profile/${job?.work?.userName}`}>
                              {job?.work !== "open" && (
                                 <p className='text-blue-500'>
                                    Work Assigned to <span className='font-medium'>@{job.work.userName}</span>
                                 </p>
                              )}
                           </Link>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
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
            theme="dark" />
         </div>

         
         {deleteModal ?
            <div className=" flex-col space-y-4 min-w-screen h-screen animated fadeIn faster  fixed  left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none   ">

            <div className="flex flex-col p-8 bg-gray-800 shadow-md hover:shodow-lg rounded-2xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            className="w-16 h-16 rounded-2xl p-3 border border-gray-800 text-blue-400 bg-gray-900" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <div className="flex flex-col ml-3">
                            <div className="font-medium leading-none text-gray-100">Delete Your Post ?</div>
                            <p className="text-sm text-gray-500 leading-none mt-1">By deleting your Post  you will lose your all data
                            </p>
                        </div>
                    </div>

                </div>
                <div className='flex justify-center'>
                    <button className="flex-no-shrink w-1/3 bg-green-500 px-5  ml-4 py-2 text-sm shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-green-500 text-white rounded-full" onClick={()=>setdeleteModal(false)}>Cancel</button>
                    <button className="flex-no-shrink w-1/3 bg-red-500 px-5  ml-4 py-2 text-sm shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-red-500 text-white rounded-full" onClick={handleDelete}>Delete</button>
                </div>
            </div>
        </div>:null
         }   

  </>
   )
}

export default Client
