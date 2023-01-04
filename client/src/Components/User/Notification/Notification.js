import React, { useEffect, useState, useContext } from "react"
import { useSelector } from "react-redux"
import { getAllNotifications } from "../../../Apis/userRequests"
import { format } from "timeago.js"
import { socket } from "../../../Context/socketContext"
import { Link, useNavigate } from "react-router-dom"
import { useErrorHandler } from "react-error-boundary"
import RightSidebar from "../NavigationBars/RightSidebar/RightSidebar"


function Notification() {

   const navigate = useNavigate()
   const PF = process.env.REACT_APP_PUBLIC_FOLDER
   const handleError = useErrorHandler()

   const userData = useSelector((state) => state.user)

   const [notifications, setNotifications] = useState([])
   const [notCount,setNotCount] = useState([])
   

   useEffect(()=>{
      socket.on("getNotification",data =>{
         setNotCount((prev)=>[...prev,data])
      })
   },[socket])

   useEffect(() => {
      try {
         const fetchNotifications = async () => {
            const { data } = await getAllNotifications(userData._id)
            setNotifications(data)
         }
         fetchNotifications()
      } catch (error) {
         if (!error?.response?.data?.auth && error?.response?.status === 403) {
            localStorage.removeItem('userToken')
            localStorage.removeItem('user')
            navigate("/signin")
         }else{
            handleError(error)
         }
      }
   }, [socket,notCount])


   return (
      <>
         <div className=' w-full h-full '>
            {/* FEEDS ADD  */}
            <div>
            <div className='w-screen md:w-full md:flex  md:justify-center h-3/4'>
            <div className='relative px-10 lg:px-0 md:w-4/5 md:ml-10 lg:ml-0 lg:w-1/2 flex-col justify-center rounded-md  bg-white min-h-screen max-h-screen overflow-y-auto no-scrollbar'>
            <div className='w-full sticky top-8 md:top-0 p-3 bg-white '>
                        <h2 className='ml-4 mt-5 font-medium text-xl'>Notifications</h2>
                     </div>
                     
                     {notifications && notifications?.length !== 0? (
                        notifications?.map((data)=>(
                        <div className='flex p-6 mx-2 max-h-full overflow-y-auto'>
                           <div>
                           <Link to={userData?.userName === data?.user?.userName?'/myprofile':`/profile/${data?.user?.userName}`}>
                              <img src={ PF+data?.user?.profilePic} className='w-10 h-9 rounded-full' alt='' />
                           </Link>
                           </div>
                           <div className='p-2  flex  md:items-center'>
                                 <p className='font-medium pr-2 mt-2 md:mt-0'>{data?.user?.userName}</p>
                                 <p className="mt-2 md:mt-0">{data?.desc} &nbsp;<span className="text-gray-400  pl-2 text-sm'">{format(data?.time)}</span></p>
                           </div>
                        </div>
                        ))

                     ) : (
                        <p className="p-4 font-medium">No notifications to show</p>
                     )}
                     <div className='w-full  '>
                        <RightSidebar/>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   )
}

export default Notification
