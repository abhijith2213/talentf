import React, { useState, useEffect, Suspense } from "react"
import { useNavigate } from "react-router"
import axios from "../../../Axios/axios"
import userInstance from "../../../Axios/userAuth"
import { ToastContainer, toast } from "react-toastify" //Toast
import "react-toastify/dist/ReactToastify.css" //Toast Css
import { BiImage } from "react-icons/bi"
import { FiCamera } from "react-icons/fi"
import { useSelector } from "react-redux"
import 'react-loading-skeleton/dist/skeleton.css'

/* ------------------------------ ICONS IMPORT ------------------------------ */

import { AiOutlineCloseCircle } from "react-icons/ai"
import { ErrorBoundary } from "react-error-boundary"
import ErrorFallback from "../../ErrorBoundary/ErrorBoundary"

const Post = React.lazy(() => import("../Posts/Post"))



function Home() {
   const PF = process.env.REACT_APP_PUBLIC_FOLDER
   const navigate = useNavigate()
   const userData = useSelector((state) => state.user)

   // STATES 

   const [effect, setEffect] = useState(false)
   const [description, setDescription] = useState("")
   const [postImage, setPostImage] = useState()
   const [showImage, setShowImage] = useState()
   const [block, setBlock] = useState("")
   const [feedPosts, setFeedPosts] = useState([])

   /* ----------------------------- FEED DISPLAYING FUNCTION---------------------------- */

   useEffect(() => {
      const userId = userData._id
      const fetchPost = async () => {
         try {
            const res = await userInstance.get(`/post/timeline_post/${userId}`)
            setFeedPosts(
               res.data.sort((pst1, pst2) => {
                  return new Date(pst2.createdAt) - new Date(pst1.createdAt)
               })
            )
         } catch (error) {
            if (!error?.response?.data?.auth && error?.response?.status === 403) {
               localStorage.removeItem('userToken')
               localStorage.removeItem('user')
               navigate("/signin")
            }
         }
      }
      fetchPost()
   }, [block, effect])

   /* ----------------------------- FEED DISPLAYING FUNCTION END ---------------------------- */

   /* ------------------------------ADD POST HANDLING ----------------------------- */

   // POST States


   const handleImage = (e) => {
      setShowImage(URL.createObjectURL(e.target.files[0]))
      setPostImage(e.target.files[0])
   }

   // REMOVE IMAGE

   const removeImage = (e) => {
      setShowImage("")
      setPostImage("")
   }

   //********** */ POST UPLOAD SUBMIT //******* */

   const handleSubmit = async (e) => {
      e.preventDefault()

      let data
      if (postImage) {
         data = new FormData()
         const fileName = postImage.name
         data.append("file", postImage)
         data.append("userId", userData._id)
         data.append("description", description)
      } else {
         data = {
            userId: userData._id,
            description: description,
         }
      }
      try {
         axios
            .post("/uploadPost", data)
            .then((res) => {
               setEffect(!effect)
               removeImage()
               setDescription("")
            })
            .catch((err) => {
               console.log(err, "its err")
               toast.warn('provide a valid image')
            })
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

   /* ---------------------------ADD POST HANDLING ENDS --------------------------- */

   return (
      <>
         <div className=' w-full h-full '>
            {/* FEEDS ADD  */}
            <div>
               <div className=' pt-16 flex justify-center'>
                  <div className='w-screen flex justify-center'>
                     <div className='bg-[#FFFFFF] w-[470px] rounded-lg shadow-md border mb-4 '>
                        <form onSubmit={handleSubmit}>
                           <div className='flex justify-between items-center'>
                              <div className='h-16  flex items-center'>
                                 <img
                                    className=' rounded-full w-10 h-10 mx-3'
                                    src={PF + userData.profilePic}
                                    alt='profile-pic'
                                 />
                                 <div className='pr-4 '>
                                    <p className='font-medium text-sm '>{userData.fullName}</p>
                                    <div className='flex gap-4 items-center'>
                                       <p className='text-xs'>{userData.userName}</p>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <div className='w-full px-8 pt-2 relative'>
                              <textarea
                                 className='w-full outline-none'
                                 name='post_description'
                                 id='description'
                                 cols='50'
                                 rows='3'
                                 placeholder='Whats new! '
                                 value={description}
                                 onChange={(e) => {
                                    setDescription(e.target.value)
                                 }}
                              ></textarea>
                              {showImage ? (
                                 <span>
                                    <span className='absolute top-20 right-4 text-xl cursor-pointer' onClick={removeImage}>                                  
                                       <AiOutlineCloseCircle className=""/>
                                    </span>
                                    <img src={showImage} alt='' className='relative h-[360px]' />
                                 </span>
                              ) : null}
                           </div>
                           <hr />
                           <div className='flex justify-between p-4'>
                              <label htmlFor='img-upload' className='cursor-pointer'>
                                 <BiImage className='text-2xl text-blue-600' />
                              </label>
                              <input
                                 type='file'
                                 name='file'
                                 id='img-upload'
                                 accept='image/*'
                                 onChange={handleImage}
                                 className='hidden'
                              />
                              <button
                                 disabled={!description}
                                 type='submit'
                                 className='text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 dark:shadow-blue-800/80 font-medium rounded-xl text-sm px-5 py-1 text-center mr-2 mb-2 disabled:opacity-50'
                              >Post
                              </button>
                           </div>
                        </form>
                     </div>
                  </div>
               </div>
            </div>
            {feedPosts.length !== 0 ? (
               feedPosts?.map((post, i) => (
                  <>
                     {post?.reports?.includes(userData._id) ? null : (
                        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {}}>
                           <Suspense fallback={<div className='text-xl text-center m-5'>Loading...</div>}>
                              <Post key={post._id} post={post} setBlock={setBlock} />
                           </Suspense>
                        </ErrorBoundary>
                     )}
                  </>
               ))
            ) : (
               <div className=' w-screen flex justify-center'>
                  <div className='flex flex-col items-center mt-20 '>
                     <FiCamera className='text-7xl text-gray-500' />
                     <p className='text-gray-500 font-medium text-xl h-max'>No Post to Show</p>
                     <p className='text-blue-400 font-medium text-xl h-max'>Follow SomeOne to See Posts!</p>
                  </div>
               </div>
            )}
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
      </>
   )
}

export default Home
