import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router"

import { ToastContainer, toast } from "react-toastify" //Toast
import "react-toastify/dist/ReactToastify.css" //Toast Css

import "./Profile.css"

import { MdOutlinePhotoCameraBack, MdArchive, MdDynamicFeed, MdModeEditOutline } from "react-icons/md"
import { BiImage } from "react-icons/bi"
import { FaRegHeart } from "react-icons/fa"
import { getUserByUsername, getUserFollowers, getUserFollowing, updateCoverPic } from "../../../Apis/userRequests"
import userInstance from "../../../Axios/userAuth"
import { useErrorHandler } from "react-error-boundary"
import { addMessage } from "../../../Redux/User/message"

function Profile() {
   const navigate = useNavigate()
   const dispatch = useDispatch()
   const PF = process.env.REACT_APP_PUBLIC_FOLDER

   const userData = useSelector((state) => state.user)
   let userId = userData?._id
   const handleError = useErrorHandler()

   const [selected, setSelected] = useState(true)

   const [myPosts, setMyPosts] = useState([])
   const [user, setUser] = useState({})
   const [effectCall, setEffectCall] = useState(false)
   let userName = useParams().userName
   if (!userName) {
      userName = userData.userName
   }

   useEffect(() => {
      const getUserData = async () => {
         try {
            const { data } = await getUserByUsername(userName)
            setUser(data)
            if (selected) {
               userInstance.get(`/profile/myposts/${data._id}`).then((res) => {
                  setMyPosts(res.data)
               })
            } else {
               userInstance.get(`/profile/myposts/archieves/${userId}`).then((res) => {
                  setMyPosts(res.data)
               })
            }
         } catch (error) {
            if (!error?.response?.data?.auth && error?.response?.status === 403) {
               localStorage.removeItem("userToken")
               localStorage.removeItem("user")
               navigate("/signin")
            }
            handleError(error)
         }
      }
      getUserData()
   }, [userName, effectCall, selected])

   // follow
   const handleFollow = async (Id) => {
      try {
         const res = await userInstance.put(`/${userId}/follow`, { Id })
         setEffectCall(!effectCall)
      } catch (error) {
         if (!error?.response?.data?.auth && error?.response?.status === 403) {
            localStorage.removeItem("userToken")
            localStorage.removeItem("user")
            navigate("/signin")
         }
         handleError(error)
      }
   }

   // HANDLE UNFOLLOW

   const handleUnFollow = (Id) => {
      userInstance
         .put(`/${userId}/unfollow`, { Id })
         .then((res) => {
            setEffectCall(!effectCall)
         })
         .catch((error) => {
            if (!error?.response?.data?.auth && error?.response?.status === 403) {
               localStorage.removeItem("userToken")
               localStorage.removeItem("user")
               navigate("/signin")
            }
            handleError(error)
         })
   }

   // HANDLE MESSAGE

   const handleMessage = async (rid) => {

      try {
        await dispatch(addMessage(rid))
         navigate("/message")
      } catch (error) {
         console.log(error)
         handleError(error)
      }
   }

   const [showModal, setShowModal] = useState({ status: false, value: "" })

   // SHOW FOLLOWERS

   const [myFollowers, setMyFollowers] = useState([])
   const showFollowers = async () => {
      let id
      if (!userName) {
         id = userId
      } else {
         id = user._id
      }
      try {
         const { data } = await getUserFollowers(id)
         setMyFollowers(data)
         setShowModal({ status: true, value: "Followers" })
      } catch (error) {
         console.log(error)
         handleError(error)
      }
   }

   // SHOW FOLLOWINGS
   const showFollowing = async () => {
      let id
      if (!userName) {
         id = userId
      } else {
         id = user._id
      }
      try {
         const { data } = await getUserFollowing(id)
         setMyFollowers(data)
         setShowModal({ status: true, value: "Following" })
      } catch (error) {
         console.log(error)
         handleError(error)
      }
   }

   /* ------------------------------ EDIT PROFILE Cover ------------------------------ */
   const [coverPicEdit, setCoverPicEdit] = useState(false)
   const [coverPic, setCoverPic] = useState("")
   const [showImage, setShowImage] = useState("")

   const handleImage = (e) => {
      setShowImage(URL.createObjectURL(e.target.files[0]))
      setCoverPic(e.target.files[0])
   }

   const handleClose = () => {
      setCoverPic("")
      setShowImage("")
      setCoverPicEdit(false)
   }
   const handleCoverPic = async () => {
      let datas
      if (coverPic) {
         datas = new FormData()
         datas.append("file", coverPic)
         datas.append("userId", userData._id)

         try {
            const { data } = await updateCoverPic(datas)
            if (data.message) {
               toast.success(data.message)
               setEffectCall(!effectCall)
               setCoverPic("")
               setShowImage("")
               setCoverPicEdit(false)
            }
         } catch (error) {
            console.log(error)
            handleError(error)
         }
      }
   }

   return (
      <>
      
         <div className='w-full mt-10 sm:mt-16 sm:mx-4 md:mt-0 md:w-5/6  lg:w-3/4 lg:flex lg:justify-end bg-white overflow-y-auto no-scrollbar'>
            <div className='ProfileCard lg:container mt-5 '>
               {userName !== userData.userName ? (
                  <div className='ProfileImages'>
                     <img
                        className='coverPic w-full h-40 object-cover object-center '
                        src={PF + user?.coverPic}
                        alt='CoverImage'
                     />
                     <img
                        className='profilePic w-16 h-28 rounded-full'
                        src={PF + user?.profilePic}
                        alt='ProfileImage'
                     />
                  </div>
               ) : (
                  <div className='ProfileImages'>
                     <div className='relative w-full'>
                        <MdModeEditOutline
                           className='absolute text-gray-800 text-xl cursor-pointer right-5 bottom-5  rounded-full'
                           onClick={() => setCoverPicEdit(true)}
                        />
                        <img
                           className='coverPic w-full h-40 object-cover '
                           src={PF + user?.coverPic}
                           alt='CoverImage'
                        />
                     </div>
                     <img
                        className='profilePic w-16 h-28 rounded-full'
                        src={PF + user?.profilePic}
                        alt='ProfileImage'
                     />
                  </div>
               )}
               <div className='flex justify-end pr-4'>
                  {userName !== userData.userName ? (
                     <>
                        {!user?.followers?.includes(userId) ? (
                           <button
                              type='button'
                              className='text-white flex justify-center bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:outline-none  font-medium rounded-lg text-sm px-4 py-2 text-center mr-2 mb-2 w-20'
                              onClick={(e) => handleFollow(user._id)}
                           >
                              follow
                           </button>
                        ) : (
                           <>
                              <button
                                 onClick={(e) => handleMessage(user._id)}
                                 type='button'
                                 class='text-gray-900 hidden  bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center sm:inline-flex items-center mr-2 mb-2'
                              >
                                 message
                              </button>
                              <button
                                 type='button'
                                 className='text-white hidden sm:block justify-center items-center bg-gradient-to-r from-violet-500 via-violet-600 to-violet-700 hover:bg-gradient-to-br focus:outline-none  font-medium rounded-lg text-sm px-4 py-2 text-center mr-2 mb-2 w-20'
                                 onClick={(e) => handleUnFollow(user._id)}
                              >
                                 unfollow
                              </button>
                           </>
                        )}
                     </>
                  ) : (
                     <Link to={"/account/editProfile"}>
                        {" "}
                        <button
                           type='button'
                           class=' text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-700  focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800'
                        >
                           Edit Profile
                        </button>
                     </Link>
                  )}
               </div>
               <div className='ProfileName mt-9 sm:mt-0'>
                  {!userName ? (
                     <>
                        <span>{userData?.fullName}</span>
                        <span> {userData?.accountType}</span>
                        <span>{userData?.about}</span>
                     </>
                  ) : (
                     <>
                        <span>{user?.fullName}</span>
                        <span> {user?.accountType}</span>
                        <span>{user?.about}</span>
                     </>
                  )}
               </div>

               <div className='followStatus'>
                  <hr />
                  <div>
                     <div className='follow cursor-pointer' onClick={showFollowers}>
                        <span className='text-xl font-semibold'>{user?.followers?.length}</span>
                        <span className='font-medium'>followers</span>
                     </div>
                     <div className='follow'>
                        <span className='text-xl font-semibold'>{myPosts?.length}</span>
                        <span className='font-medium'>posts</span>
                     </div>

                     {/* for profilepage */}
                     <div className='follow cursor-pointer' onClick={showFollowing}>
                        <span className='text-xl font-semibold'>{user?.following?.length}</span>
                        <span className='font-medium'>following</span>
                     </div>
                  </div>
                  <div className='flex '>
                     <button
                        onClick={(e) => handleMessage(user._id)}
                        type='button'
                        class='text-gray-900 sm:hidden bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 mb-2'
                     >
                        message
                     </button>
                     <button
                        type='button'
                        className='text-white sm:hidden  flex justify-center items-center bg-gradient-to-r from-violet-500 via-violet-600 to-violet-700 hover:bg-gradient-to-br focus:outline-none  font-medium rounded-lg text-sm px-4 py-2 text-center mr-2 mb-2 w-20'
                        onClick={(e) => handleUnFollow(user._id)}
                     >
                        unfollow
                     </button>
                  </div>
                  <hr />
               </div>

               <hr className='mt-2' />
               <div className='flex justify-evenly text-gray-500 gap-4 font-medium'>
                  <span
                     className='inline-flex items-center gap-2'
                     onClick={() => setSelected(true)}
                     disabled={selected}
                  >
                     <MdDynamicFeed className='text-lg' />
                     <span className={selected ? "text-black" : "cursor-pointer"}>Feeds</span>
                  </span>
                  {userName === userData.userName && (
                     <span
                        className='inline-flex items-center gap-2'
                        onClick={() => setSelected(false)}
                        disabled={!selected}
                     >
                        <MdArchive />
                        <span className={!selected ? "text-black " : "cursor-pointer"}>Archieves</span>
                     </span>
                  )}
               </div>

               {/* profile feeds */}
               {myPosts.length !== 0 ? (
                     <div class='flex flex-wrap -mx-px md:-mx-3'>
                        {myPosts?.map((posts, i) => {
                           return (
                                 <div class='w-1/3 p-px md:px-3' key={i}>
                                    <article class='post bg-gray-100 text-white relative pb-full md:mb-6'>
                                       <img
                                          class='w-full h-full absolute left-0 top-0 object-cover'
                                          src={PF + posts.image}
                                          alt='image'
                                       />

                                       <div
                                          class='overlay bg-gray-800 bg-opacity-25 w-full h-full absolute 
                                      left-0 top-0 hidden'
                                       >
                                          <div
                                             class='flex flex-col justify-center items-center 
                                          space-x-4 h-full'
                                          >
                                             <span class='p-2 inline-flex items-center gap-2'>
                                                <FaRegHeart/>
                                                {posts?.likes?.length}
                                             </span>
                                             <span class='p-2 inline-flex items-center gap-2'>
                                                {posts?.description}
                                             </span>
                                          </div>
                                       </div>
                                    </article>
                                 </div>
                           )
                        })}
                     </div>
               ) : (
                  <div className='flex flex-col justify-center items-center w-full'>
                     <MdOutlinePhotoCameraBack className='text-6xl text-gray-400' />
                     <p className='text-gray-600 font-medium text-lg'>No Posts Yet to display!</p>
                  </div>
               )}
            </div>
         </div>
         <ToastContainer
            position='top-center'
            autoClose={3000}
            hideProgressBar
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover
            theme='dark'
         />
         <>
            {showModal.status ? (
               <>
                  <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50  outline-none focus:outline-none'>
                     <div className='relative w-auto my-6 mx-auto max-w-sm'>
                        {/*content*/}
                        <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                           {/*header*/}
                           <div className='flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t'>
                              <h3 className='text-xl font-semibold'>{showModal.value}</h3>
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
                           {myFollowers?.map((follower) => {
                              return (
                                 <div className='flex m-2 justify-between items-center  gap-3 max-h-20 overflow-y-auto no-scrollbar'>
                                    <img className='rounded-full w-10 h-10 ' src={PF + follower.profilePic} alt='pic' />
                                    <div className='flex flex-col justify-center items-center ml-3'>
                                       <p className='font-medium text-sm'>{follower?.userName}</p>
                                       <p className='font-normal text-xs'>{follower?.accountType}</p>
                                    </div>
                                    {userId === follower._id ? (
                                       <div className='p-4 w-20'>&nbsp;</div>
                                    ) : (
                                       <>
                                          {!user.following.includes(follower?._id) ? (
                                             <button
                                                type='button'
                                                className='text-white ml-3 flex justify-center items-center bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:outline-none  font-medium rounded-lg text-sm px-2  text-center mr-2 mb-2 w-20'
                                                onClick={(e) => handleFollow(follower._id)}
                                             >
                                                follow
                                             </button>
                                          ) : (
                                             <button
                                                type='button'
                                                className='text-white ml-3 flex justify-center items-center bg-gradient-to-r from-violet-500 via-violet-600 to-violet-700 hover:bg-gradient-to-br focus:outline-none  font-medium rounded-lg text-sm px-2  text-center mr-2 mb-2 w-20'
                                                onClick={(e) => handleUnFollow(follower._id)}
                                             >
                                                unfollow
                                             </button>
                                          )}
                                       </>
                                    )}
                                 </div>
                              )
                           })}
                           {/*footer*/}
                           <div className='flex items-center justify-end p-3 border-t border-solid border-slate-200 rounded-b'>
                              <button
                                 className='text-blue-500 background-transparent font-bold uppercase px-6  text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                                 type='button'
                                 onClick={() => setShowModal({ status: false, value: "" })}
                              >
                                 Close
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
               </>
            ) : null}
         </>
         {/* COVER PIC MODAL  */}

         {coverPicEdit ? (
            <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50  outline-none focus:outline-none'>
               <div className='relative w-auto my-6 mx-auto max-w-sm'>
                  <div className=' pt-16 flex justify-center  '>
                     <div className='w-screen flex justify-center'>
                        <div className='bg-[#FFFFFF] w-[470px] rounded-lg shadow-md border mb-4 pt-2'>
                           <div className='flex gap-2 pl-4'>
                              {!showImage && <BiImage className='text-2xl text-blue-600' />}
                              <label htmlFor='img-upload' className='cursor-pointer pl-3 font-medium'>
                                 Select Cover Image
                              </label>
                              <input
                                 type='file'
                                 name='file'
                                 id='img-upload'
                                 onChange={handleImage}
                                 className='hidden'
                              />
                           </div>
                           <div className='w-full px-8 pt-2'>
                              {showImage ? (
                                 <span>
                                    <img
                                       src={showImage}
                                       alt=''
                                       className='relative h-40 w-full rounded-md object-fill object-center'
                                    />
                                 </span>
                              ) : null}
                           </div>
                           <hr />
                           <div className='w-full p-4'>
                              <div className='flex gap-2 justify-end'>
                                 <button
                                    className='px-2 py-1 text-sm text-white bg-red-400 rounded-lg text-center mr-2 mb-2 '
                                    onClick={handleClose}
                                 >
                                    close
                                 </button>
                                 <button
                                    type='submit'
                                    onClick={handleCoverPic}
                                    disabled={!coverPic}
                                    className='text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 dark:shadow-blue-800/80 font-medium rounded-xl text-sm px-5 py-1 text-center mr-2 mb-2 disabled:opacity-50'
                                 >
                                    Update
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         ) : null}
      </>
   )
}

export default Profile
