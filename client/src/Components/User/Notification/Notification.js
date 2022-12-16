import React, { useEffect, useState, useContext } from "react"
import { useSelector } from "react-redux"
import { getAllNotifications } from "../../../Apis/userRequests"
import { format } from "timeago.js"
import { socket } from "../../../Context/socketContext"
import { Link, useNavigate } from "react-router-dom"


function Notification() {

   const navigate = useNavigate()
   const PF = process.env.REACT_APP_PUBLIC_FOLDER


   const userData = useSelector((state) => state.user)

   const [notifications, setNotifications] = useState([])
   const [notCount,setNotCount] = useState([])
   
   console.log(notCount,'notcount');

   localStorage.setItem('count', 0);


   useEffect(()=>{
      console.log('effect called');
      socket.on("getNotification",data =>{
         setNotCount((prev)=>[...prev,data])
      })
   },[socket])

   useEffect(() => {
      try {
         const fetchNotifications = async () => {
            const { data } = await getAllNotifications(userData._id)
            console.log(data, "notyyyyyy")
            setNotifications(data)
         }
         fetchNotifications()
      } catch (error) {
         if (!error?.response?.data?.auth && error?.response?.status === 403) {
            localStorage.removeItem('userToken')
            localStorage.removeItem('user')
            navigate("/signin")
         }
      }
   }, [socket,notCount])


   return (
      <>
         <div className=' w-full h-full '>
            {/* FEEDS ADD  */}
            <div>
               <div className='pt-16 md:pt-10 flex justify-center h-3/4'>
                  <div className='w-4/5 md:w-1/2 flex-col justify-center rounded-md  bg-white min-h-screen max-h-screen overflow-y-auto no-scrollbar'>
                     <div className='w-full'>
                        <h2 className='ml-4 mt-2 font-medium text-lg'>Notifications</h2>
                     </div>
                     
                     {notifications && notifications?.length !== 0? (
                        notifications?.map((data)=>(
                        <div className='flex p-6 mx-2 max-h-full overflow-y-auto'>
                           <div>
                           <Link to={userData?.userName === data?.user?.userName?'/myprofile':`/profile/${data?.user?.userName}`}>
                              <img src={ PF+data?.user?.profilePic} className='w-10 rounded-full' alt='' />
                           </Link>
                           </div>
                           <div className='p-2 flex items-center'>
                              <p className='font-medium pr-2'>{data?.user?.userName}</p>
                              <p>{data?.desc}</p>
                              <p className='text-gray-400 pl-2 text-sm '>{format(data?.time)}</p>
                           </div>
                        </div>
                        ))

                     ) : (
                        <p className="p-4 font-medium">No notifications to show</p>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </>
   )
}

export default Notification
