import React, { useContext, useState } from "react"
import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { format } from "timeago.js"
import { ToastContainer, toast } from "react-toastify" //Toast
import "react-toastify/dist/ReactToastify.css" //Toast Css

// Assets
import profile from "../../../assets/images/download.png"
import { BsThreeDotsVertical, BsFlagFill } from "react-icons/bs"
import { FaRegPaperPlane } from "react-icons/fa"

import { reportJobPost, sendConnect } from "../../../Apis/JobRequests"
import { newUserChat } from "../../../Apis/chatRequests"
import { socket } from "../../../Context/socketContext"
import { useErrorHandler } from "react-error-boundary"



function Freelancer({ job, setEffect }) {
   const PF = process.env.REACT_APP_PUBLIC_FOLDER
   const handleError = useErrorHandler()

   const navigate = useNavigate()

   const userData = useSelector((state) => state.user)
   const userId = userData._id
   const [options, setOptions] = useState(false)

   const handleConnect = async () => {
      try {
         const { data } = await sendConnect(userId, job._id)
         setEffect(Date.now())

         if(data){
            socket.emit('send-notification',{
               senderId:userId,
               recieverId:job.userId._id,
               type:'Send a connect Request'
            })
         }
         toast.warn(data.message)
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

   /* ------------------------------- REPORT JOBS ------------------------------ */

   const [reason, setReason] = useState("")
   const [showModal, setShowModal] = useState(false)

   const handleBlock = async (e) => {
      try {
         const { data } = await reportJobPost(reason, job._id, userId)
         setReason("")
         setEffect(Date.now())
         toast.warn(data.message)
         setShowModal(false)
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

   /* --------------------------------- MEssage -------------------------------- */
   const handleMessage = async (rid) => {
      let users = {
         senderId: userId,
         receiverId: rid,
      }
      try {
         const { data } = await newUserChat(users)
         navigate("/message")
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
                     <Link to={`/profile/${job?.userId?.userName}`}>
                        <div className='h-16  flex items-center'>
                           <img
                              className=' rounded-full w-10 mx-3'
                              src={job?.userId?.profilePic ? PF + job?.userId?.profilePic : profile}
                              alt='profile-pic'
                           />
                           <div className='pr-4 '>
                              <p className='font-medium text-sm '>{job?.userId?.fullName}</p>
                              <div className='flex gap-4 items-center'>
                                 <p className='text-xs'>@{job?.userId?.userName}</p>
                              </div>
                           </div>
                        </div>
                     </Link>

                     <div className='pr-3 relative'>
                        <div>
                           <span onClick={() => setOptions(!options)} className='cursor-pointer'>
                              <BsThreeDotsVertical />
                           </span>
                           {options && (
                              <ul
                                 className='cursor-pointer dropdown-menu min-w-max absolute right-0 bg-white text-base z-50 float-left py-2 list-none
                                text-left rounded-lg shadow-lg mt-1 m-0 bg-clip-padding border-none'
                              >
                                 <li>
                                    <span
                                       onClick={() => setShowModal(true)}
                                       className='dropdown-item text-sm inline-flex items-center text-red-600 py-2 px-4 font-normal  w-full whitespace-nowrap
                                      bg-transparent  hover:bg-gray-100'
                                    >
                                       <BsFlagFill className='mr-2' /> Report
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
                           )}
                        </div>
                     </div>

                     {/* SIDE DOT END  */}
                  </div>
                  <div className='flex flex-col p-6'>
                     <div className='flex flex-col gap-2 mb-2 mx-3'>
                        <div className='flex gap-2 items-center'>
                           <p className=''>Job Role :</p>
                           <span className='font-medium'>{job?.jobRole}</span>
                        </div>

                        <div className='flex gap-2 items-center'>
                           <p className=''>Work Type :</p>
                           <span className='font-medium'>{job?.workType}</span>
                        </div>
                        <div className='flex gap-2 items-center'>
                           <p className=''>Work Period :</p>
                           <span className='font-medium'>{job?.workPeriod}</span>
                        </div>
                        <div className='flex gap-2 '>
                           <p className=''>Description:</p>
                           <span className='text-lg'>{job?.description}</span>
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
                           {job?.work === "open" ? (
                              <>
                                 {job?.requests.includes(userId) ? (
                                    <button
                                       className='disabled:bg-blue-300 cursor-not-allowed flex items-center gap-2 text-white font-bold py-2 px-4 rounded'
                                       disabled
                                    >
                                       <FaRegPaperPlane /> Connected
                                    </button>
                                 ) : (
                                    <button
                                       className='bg-blue-500 hover:bg-blue-700 flex items-center gap-2 text-white font-bold py-2 px-4 rounded'
                                       onClick={handleConnect}
                                    >
                                       <FaRegPaperPlane /> Connect
                                    </button>
                                 )}
                              </>
                           ) : (
                              <button
                                 onClick={(e) => handleMessage(job?.userId?._id)}
                                 type='button'
                                 className='text-blue-500 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 mb-2'
                              >message
                              </button>
                           )}
                        </div>
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
         theme="dark"/>

         {showModal ? (
            <>
               <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50  outline-none focus:outline-none'>
                  <div className='relative w-auto my-6 mx-auto max-w-sm'>
                     {/*content*/}
                     <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                        {/*header*/}
                        <div className='flex gap-3  justify-between items-center p-5 border-b border-solid border-slate-200 rounded-t'>
                           <h3 className='text-md text-black font-semibold inline'>Why are you reporting this post?</h3>
                           <button
                              className='p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none'
                              onClick={() => setShowModal(false)}
                           >
                              <span className='bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none'>
                                 ×
                              </span>
                           </button>
                        </div>
                        {/*body*/}

                        <div className='flex flex-col m-2 justify-center  gap-3 max-h-50 overflow-y-auto no-scrollbar'>
                           <div className='px-3'>
                              <input
                                 type='radio'
                                 required
                                 className='mr-2'
                                 value="It's spam"
                                 name='reason'
                                 onChange={(e) => setReason(e.target.value)}
                              />
                              <label htmlFor='reason'>It's spam</label>
                           </div>
                           <div className='px-3'>
                              <input
                                 type='radio'
                                 className='mr-2'
                                 name='reason'
                                 value="I just don't like it"
                                 onChange={(e) => setReason(e.target.value)}
                              />
                              <label htmlFor='reason'>I just don't like it</label>
                           </div>
                           <div className='px-3'>
                              <input
                                 type='radio'
                                 className='mr-2'
                                 name='reason'
                                 value='false Information'
                                 onChange={(e) => setReason(e.target.value)}
                              />
                              <label htmlFor='reason'>false Information</label>
                           </div>
                           <div className='px-3'>
                              <input
                                 type='radio'
                                 className='mr-2'
                                 name='reason'
                                 value='Scam or Fraud'
                                 onChange={(e) => setReason(e.target.value)}
                              />
                              <label htmlFor='reason'>Scam or Fraud</label>
                           </div>
                           <div className='px-3'>
                              <input
                                 type='radio'
                                 className='mr-2'
                                 name='reason'
                                 value='Hate speech or symbols'
                                 onChange={(e) => setReason(e.target.value)}
                              />
                              <label htmlFor='reason'>Hate speech or symbols</label>
                           </div>
                        </div>
                        {/*footer*/}
                        <div className='flex items-center justify-end p-3 border-t border-solid border-slate-200 rounded-b'>
                           <button
                              className='text-gray-500 background-transparent font-bold uppercase px-6  text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                              type='button'
                              onClick={() => setShowModal(false)}
                           >
                              Close
                           </button>
                           <button
                              className='bg-cyan-600 hover:bg-red-400 text-white font-bold py-1 px-4 rounded inline-flex items-center disabled:bg-cyan-100'
                              onClick={handleBlock}
                              disabled={!reason}
                           >
                              <span>Submit</span>
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
               <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
            </>
         ) : null}
      </>
   )
}

export default Freelancer
