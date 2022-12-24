/* --------------------------------- ASSETS --------------------------------- */

import { HiOutlineLogout } from "react-icons/hi"
import { MdNotificationsNone, MdWorkOutline } from "react-icons/md"
import { FiMessageSquare } from "react-icons/fi"
import { BiHome, BiSearchAlt2 } from "react-icons/bi"
import { CgProfile } from "react-icons/cg"

import log from "../../../../assets/images/talentF-c.png"

/* --------------------------------- ASSETS END--------------------------------- */

import React, { useEffect, useContext, useState } from "react"
import { useNavigate, Link, NavLink } from "react-router-dom"
import { confirmAlert } from "react-confirm-alert"
import { useDispatch, useSelector } from "react-redux"
import { remove } from "../../../../Redux/User/userSlice"
import { socket } from "../../../../Context/socketContext"
import { fetchNoCounts, findSearch, handleNotCount } from "../../../../Apis/userRequests"
import { useErrorHandler } from "react-error-boundary"

function Sidebar() {
   const navigate = useNavigate()
   const dispatch = useDispatch()
   const handleError = useErrorHandler()
   const userData = useSelector((state) => state.user)
   const PF = process.env.REACT_APP_PUBLIC_FOLDER

   const [notifications, setNotifications] = useState("")

   const fetchnotificationCount = async () => {
      try {
         const { data } = await fetchNoCounts(userData._id)
         setNotifications(data)
      } catch (error) {
         handleError(error)
      }
   }

   useEffect(() => {
      if (userData) {
         socket.emit("new-user-add", userData._id)
      }

      fetchnotificationCount()
   }, [])

   useEffect(() => {
      socket.on("getNotification", (data) => {
         fetchnotificationCount()
      })
   }, [socket, notifications])

   /* ------------------------------ HANDLE LOGOUT ----------------------------- */

   const handleLogout = () => {
      confirmAlert({
         title: "Logout!",
         message: "Are you sure to Logout .",
         buttons: [
            {
               label: "Yes",
               onClick: () => {
                  localStorage.removeItem("userToken")
                  localStorage.removeItem("user")
                  dispatch(remove())
                  navigate("/signin")
               },
            },
            {
               label: "No",
            },
         ],
      })
   }

   /* ------------------------ HANDLE NOTIFICATION COUNT ----------------------- */

   const handleNotiView = async () => {
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
          setSearchUser(data)
       } catch (error) {
         handleError(error)
       }
    }

   /* --------------------------------- OPTIONS -------------------------------- */
   const [modal, setModal] = useState(false)
   const [searchModal, setSearchModal] = useState(false)

   const menus = [
      { name: "Home", link: "/home", icon: BiHome },
      { name: "messages", link: "/message", icon: FiMessageSquare },
      {
         name: "Notifications",
         link: "/notifications",
         icon: MdNotificationsNone,
         notifications: true,
         action: handleNotiView,
      },
      { name: "Works", link: "/works", icon: MdWorkOutline },
      { name: "My Profile", link: "/myprofile", icon: CgProfile },
   ]

   return (
      <>
         <div
            hidden
            className='border shadow-md min-h-screen lg:pl-7 lg:pr-12 bg-white fixed md:block  md:w-20  lg:w-64 overflow-hidden '
         >
            <div hidden className='text-center mt-8 mb-9 lg:block flex justify-center '>
               <img className=' lg:w-3/4  mt-2' src={log} alt='' />
            </div>
            <div className=' flex flex-col gap-6 justify-start relative md:items-center lg:items-start'>
               {menus?.map((menu, i) => (
                  <NavLink
                     to={menu?.link}
                     key={i}
                     onClick={menu.action}
                     className={` ${
                        menu?.notifications && ""
                     } group flex items-center text-sm  gap-3.5 font-medium p-2 hover:bg-gray-300 rounded-md`}
                  >
                     {menu.name == "Logout" ? (
                        <div className='text-2xl' onClick={handleLogout}>
                           {React.createElement(menu?.icon)}
                        </div>
                     ) : (
                        <div className='text-2xl'>{React.createElement(menu?.icon)}</div>
                     )}
                     <h2
                        style={{
                           transitionDelay: `${i + 3}00ms`,
                        }}
                        className={`whitespace-pre duration-500 font-normal pr-8 hidden lg:block`}
                     >
                        {menu?.name}
                     </h2>
                     {menu.notifications && notifications !== 0 ? (
                        <p className='px-1 text-white bg-red-500 rounded-full'>{notifications}</p>
                     ) : null}
                  </NavLink>
               ))}
               <div
                  className='group flex items-center text-sm  gap-3.5 font-medium p-2 hover:bg-gray-300 rounded-md cursor-pointer'
                  onClick={() => setSearchModal(true)}
               >
                  <div className='text-2xl'>{React.createElement(BiSearchAlt2)}</div>
                  <h2 className={`whitespace-pre duration-500 font-normal pr-8 hidden lg:block`}>Search</h2>
               </div>
               <div
                  className='group flex items-center text-sm  gap-3.5 font-medium p-2 hover:bg-gray-300 rounded-md cursor-pointer'
                  onClick={() => setModal(true)}
               >
                  <div className='text-2xl'>{React.createElement(HiOutlineLogout)}</div>
                  <h2 className={`whitespace-pre duration-500 font-normal pr-8 hidden lg:block`}>Logout</h2>
               </div>
            </div>
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

         {/* SEARCH  */}

         {searchModal ? (
            <div className='absolute flex justify-center items-center bg-white bg-opacity-50  z-50  w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full'>
               <div className='relative w-full h-full max-w-md md:h-auto'>
                  <div className=' bg-white rounded-lg shadow dark:bg-gray-700'>
                     <button
                        type='button'
                        onClick={() => setSearchModal(false)}
                        className='absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white'
                        data-modal-toggle='crypto-modal'
                     >
                        X<span className='sr-only'>Close modal</span>
                     </button>
                     <div className='px-6 py-4  border-b rounded-t dark:border-gray-600'>
                        <div className='relative text-gray-600 '>
                           <span className='absolute inset-y-0 left-0 flex items-center pl-2'>
                              <svg
                                 fill='none'
                                 stroke='currentColor'
                                 stroke-linecap='round'
                                 stroke-linejoin='round'
                                 stroke-width='2'
                                 viewBox='0 0 24 24'
                                 className='w-6 h-6 text-gray-300'
                              >
                                 <path d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'></path>
                              </svg>
                           </span>
                           <input
                              type='search'
                              onChange={handleSearch}
                              className='block mt-6 w-full py-2 pl-10 bg-gray-100 rounded-xl outline-none'
                              name='search'
                              placeholder='Search....'
                              required
                           />
                        </div>
                     </div>
                     <div className='p-6'>
                        <ul className='my-4 space-y-3 max-h-[50%] overflow-y-auto no-scrollbar'>
                           {serachUser.length !== 0
                              ? serachUser.map((user) => (
                                   <Link to={`/profile/${user.userName}`}>
                                      <li className='m-2'>
                                         <div className='flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white'>
                                            <img
                                               class='object-cover w-10 h-10 rounded-full'
                                               src={PF + user.profilePic}
                                               alt=''
                                            />

                                            <span className='flex-1 ml-3 whitespace-nowrap'>{user.userName}</span>
                                            <span className='inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400'>
                                               {user.accountType}
                                            </span>
                                         </div>
                                      </li>
                                   </Link>
                                ))
                              : null}
                        </ul>
                     </div>
                  </div>
               </div>
            </div>
         ) : null}
      </>
   )
}

export default Sidebar
