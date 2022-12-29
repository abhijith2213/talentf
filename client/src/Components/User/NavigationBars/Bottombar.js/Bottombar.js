import React, { useEffect, useContext, useState } from "react"
import { MdNotificationsNone, MdWorkOutline } from "react-icons/md"
import { FiMessageSquare } from "react-icons/fi"
import { BiHome, BiMessageSquareAdd } from "react-icons/bi"
import { CgProfile } from "react-icons/cg"

import log from "../../../../assets/images/talentF-c.png"
import { Link, useNavigate } from "react-router-dom"
import { socket, SocketContext } from "../../../../Context/socketContext"
import { useSelector, useDispatch } from "react-redux"
import { confirmAlert } from "react-confirm-alert"
import { remove } from "../../../../Redux/User/userSlice"
import { fetchNoCounts, findSearch } from "../../../../Apis/userRequests"
import { useErrorHandler } from "react-error-boundary"

function Bottombar() {
   const userData = useSelector((state) => state.user)

   const PF = process.env.REACT_APP_PUBLIC_FOLDER

   const dispatch = useDispatch()
   const navigate = useNavigate()
   const handleError = useErrorHandler()
   const [open, setOpen] = useState(false)
   const [notifications, setNotifications] = useState("")

   /* ------------------------- NOTIFICATION MANAGEMENT ------------------------ */

   const fetchnotificationCount = async () => {
      try {
         const { data } = await fetchNoCounts(userData._id)
         setNotifications(data)
      } catch (error) {
         console.log(error)
      }
   }

   useEffect(() => {
      if (userData) {
         socket.emit("new-user-add", userData._id)
         fetchnotificationCount()
      }
   }, [])

   useEffect(() => {
      socket.on("getNotification", (data) => {
         fetchnotificationCount()
      })
   }, [socket, notifications])

   /* --------------------------------- LOGOUT --------------------------------- */

   const handleLogout = () => {
      localStorage.removeItem("userToken")
      localStorage.removeItem("user")
      dispatch(remove())
      navigate("/signin")
   }

   const handleMessage = async ()=>{
      await dispatch(addMessage(null))
   }

      /* ------------------------ HANDLE NOTIFICATION COUNT ----------------------- */

      const handleNotiView = async () => {
         console.log("hi action")
         try {
            const { data } = await handleNotCount(userData._id)
         } catch (error) {
            handleError(error)
         }
      }

   /* ------------------------------ SEARCH USERS ------------------------------ */

   const [serachUser, setSearchUser] = useState([])

   const handleSearch = async (e) => {
      const val = e.target.value
      if (val == "") {
         setSearchUser([])
      }
      try {
         const { data } = await findSearch(val)
         console.log(data, "jjjjjj")
         setSearchUser(data)
      } catch (error) {
         handleError(error)
      }
   }

   /* ---------------------------------- MENUS --------------------------------- */
   const [modal, setModal] = useState(false)

   const menus = [
      { name: "works", link: "/works", icon: MdWorkOutline },
      { name: "Home", link: "/home", icon: BiHome },
      { name: "Messages", link: "/message", icon: FiMessageSquare, bottom: true ,action:handleMessage},
   ]

   return (
      <>
         <div className='border shadow-md  bg-white fixed bottom-0 w-full md:hidden'>
            <div className=' flex  justify-around  relative  '>
               {menus?.map((menu, i) => (
                  <Link
                     to={menu?.link}
                     key={i}
                     onClick={menu.action}
                     className={` ${
                        menu?.bottom && ""
                     } group flex items-center text-sm  gap-3.5 font-medium p-2 hover:bg-gray-300 rounded-md`}
                  >
                     <div className='text-2xl sm:text-3xl'>{React.createElement(menu?.icon)}</div>
                     <h2
                        style={{
                           transitionDelay: `${i + 3}00ms`,
                        }}
                        className={`whitespace-pre duration-500 font-normal pr-8 hidden lg:block`}
                     >
                        {menu?.name}
                     </h2>
                  </Link>
               ))}
            </div>
         </div>
         {/* TOP BAR  */}
         <div className='border shadow-md  bg-white fixed top-0 w-full md:hidden'>
            <div className='flex justify-between items-center relative p-3 '>
               <div className='flex items-center justify-between'>
                  <img className='w-20 h-auto ' src={log} alt='' />
               </div>
               <div className=''>
                  <div class='relative text-gray-600 '>
                     <span class='absolute inset-y-0 left-0 flex items-center pl-2'>
                        <svg
                           fill='none'
                           stroke='currentColor'
                           stroke-linecap='round'
                           stroke-linejoin='round'
                           stroke-width='2'
                           viewBox='0 0 24 24'
                           class='w-6 h-6 text-gray-300'
                        >
                           <path d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'></path>
                        </svg>
                     </span>
                     <input
                        type='search'
                        onChange={handleSearch}
                        className='block w-full py-2 pl-10 bg-gray-100 rounded-xl outline-none'
                        name='search'
                        placeholder='Search....'
                        required
                     />
                  </div>
                  <div className='max-h-32 overflow-y-auto absolute  bg-white w-[45%] sm:w-1/3 no-scrollbar'>
                     {serachUser.length !== 0
                        ? serachUser.map((user) => (
                             <div className='flex flex-col'>
                                {console.log(user)}
                                <Link to={`/profile/${user.userName}`}>
                                   <a class='flex items-center px-3 py-2 text-sm transition duration-150  ease-in-out  cursor-pointer hover:bg-gray-100 focus:outline-none'>
                                      <img
                                         class='object-cover w-10 h-10 rounded-full'
                                         src={PF + user.profilePic}
                                         alt=''
                                      />
                                      <div class='w-full pb-2'>
                                         <div class='flex justify-between'>
                                            <span class='block ml-2 font-semibold text-gray-600'>{user.userName}</span>
                                         </div>
                                         <span class='block ml-2 text-sm text-gray-400'>{user.accountType}</span>
                                      </div>
                                   </a>
                                </Link>
                             </div>
                          ))
                        : null}
                  </div>
               </div>
               <div className='flex gap-5 text-2xl '>
                  <div  onClick={handleNotiView}>
                     {notifications !== 0 ? (
                        <p className='px-1 text-xs absolute text-white bg-red-500 rounded-full'>{notifications}</p>
                     ) : null}
                     <Link to={"/notifications"}>{React.createElement(MdNotificationsNone)}</Link>
                  </div>
                  <CgProfile onClick={() => setOpen(!open)} />
               </div>
            </div>
            {open ? (
               <div className='bg-gray-200 rounded-md absolute right-2 p-4'>
                  <Link to={"/myprofile"}>
                     <p className='cursor-pointer'>my profile</p>
                  </Link>
                  <p className='cursor-pointer' onClick={() => setModal(true)}>
                     Logout
                  </p>
               </div>
            ) : null}
         </div>
         {/* MODAL  */}
         {modal ? (
            <div class=' flex-col space-y-4 min-w-screen h-screen animated fadeIn faster  fixed  left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none  bg-white bg-opacity-50'>
               <div class='flex flex-col p-8 bg-gray-800 shadow-md hover:shodow-lg rounded-2xl'>
                  <div class='flex items-center justify-between'>
                     <div class='flex items-center'>
                        <svg
                           xmlns='http://www.w3.org/2000/svg'
                           class='w-16 h-16 rounded-2xl p-3 border border-gray-800 text-blue-400 bg-gray-900'
                           fill='none'
                           viewBox='0 0 24 24'
                           stroke='currentColor'
                        >
                           <path
                              stroke-linecap='round'
                              stroke-linejoin='round'
                              stroke-width='2'
                              d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                           ></path>
                        </svg>
                        <div class='flex flex-col ml-3'>
                           <div class='font-medium leading-none text-gray-100'>Are you Sure to Logout ?</div>
                           <p class='text-sm text-gray-500 leading-none mt-1'>
                              Your current session will be destroyed!
                           </p>
                        </div>
                     </div>
                  </div>
                  <div className='flex justify-center'>
                     <button
                        class='flex-no-shrink w-1/3 bg-green-500 px-5  ml-4 py-2 text-sm shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-green-500 text-white rounded-full'
                        onClick={() => setModal(false)}
                     >
                        Cancel
                     </button>
                     <button
                        class='flex-no-shrink w-1/3 bg-red-500 px-5  ml-4 py-2 text-sm shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-red-500 text-white rounded-full'
                        onClick={handleLogout}
                     >
                        Logout
                     </button>
                  </div>
               </div>
            </div>
         ) : null}
      </>
   )
}

export default Bottombar
