import React, { useState, useEffect, useContext } from "react"
import { Link ,useNavigate} from "react-router-dom"
import { useSelector } from "react-redux"
import { format } from "timeago.js"
import { ToastContainer, toast } from "react-toastify" //Toast
import "react-toastify/dist/ReactToastify.css" //Toast Css
import userInstance from "../../../Axios/userAuth"
import { useErrorHandler } from "react-error-boundary"

import profile from "../../../assets/images/download.png"
import './Post.css'

/* ------------------------------ ICONS IMPORT ------------------------------ */

import { BsThreeDotsVertical, BsFlagFill } from "react-icons/bs"
import { FaRegHeart, FaRegComment, } from "react-icons/fa"
import { FcLike } from "react-icons/fc"
import { reportUserPost, deleteUserPost } from "../../../Apis/PostRequest"
import { socket } from "../../../Context/socketContext"



function Post({ post , setBlock}) {

   const navigate = useNavigate()
   const PF = process.env.REACT_APP_PUBLIC_FOLDER
   const userData = useSelector((state) => state.user)
   const userId = userData._id
   const [user, setUser] = useState({})
   const [showDrop, setShowDrop]= useState(false)
   const [showModal,setShowModal] = useState(false)

   const handleError = useErrorHandler()
   const [deleteModal,setDeleteModal] = useState(false)


   useEffect(() => {
         const fetchPostUser = async () => {
            try {               
               const res = await userInstance.get(`/postDetails/users?userId=${post.userId}`)
               setUser(res.data)
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
         fetchPostUser()
   }, [post.userId])

   /* ---------------------------- HANDLE POST LIKES --------------------------- */


   const [likeState, setLikeState] = useState(false)

   const [like, setLike] = useState(post?.likes?.length)

   const handleLike = async (e) => {
      try {       
         let res = await userInstance.put(`/post/like/${post._id}`, { userId: userId })
         setLikeState(!likeState)
         setLike(likeState ? like - 1 : like + 1)
   
         if(post.userId !== userId){
            socket.emit('send-notification',{
               senderId:userId,
               recieverId:post.userId,
               type:'liked your post'
            })
         }
      } catch (error) {
         if (!error?.response?.data?.auth && error?.response?.status === 403) {
            localStorage.removeItem('userToken')
            localStorage.removeItem('user')
            navigate("/signin")
         }
         handleError(error)
      }
   }

   useEffect(() => {
      setLikeState(post.likes.includes(userId))
   }, [userId, post._id])

   /* -------------------------- POST COMMENT HANDLING ------------------------- */

   // State

   const [commentUpdate, setCommentUpdate] = useState(false)
   const [comment, setComment] = useState("")

   // function

   const handleSetComment = (e) => {
      if (/^\s/.test(e.target.value)) setComment("")
      else setComment(e.target.value)
   }

   // ADD COMMENT 

   const handleComment = async (e) => {
      e.preventDefault()
      const data = {
         userId: userId,
         comment: comment,
         postUser:post.userId
      }

      try {
         let res = await userInstance.put(`/post/comment/${post._id}`, { ...data })
         setComment("")
         setCommentUpdate(!commentUpdate)

         if(post.userId !== userId){
         socket.emit('send-notification',{
            senderId:userId,
            recieverId:post.userId,
            type:'Commented on your post'
         })
      }
         toast.success(res.data.message)
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

   /* ---------------------------- VIEW ALL COMMENTS --------------------------- */

   const [viewComment, setViewComment] = useState(false)
   const [allComments, setAllComments] = useState([])

   useEffect(() => {
      
      const fetchComments = async () => {
         try {          
            let res = await userInstance.get(`/post/viewComments/${post._id}`)
            setAllComments(res.data)
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
      fetchComments()
   }, [viewComment, commentUpdate])

   // VIEW COMMENT 

   const handleViewComment = async (e) => {
      e.preventDefault()
      setViewComment(!viewComment)
   }

   // DELETE POST 

   const deletePost = async ()=>{

      try {
         const {data} = await deleteUserPost(post._id) 
         setBlock(Date.now())
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

   // BLOCK POST 
   const [reason,setReason] = useState('')

   const handleBlock =async()=>{
      try {
         const {data} = await reportUserPost(reason,post._id,userId) 
         setReason('')
         setBlock(Date.now())
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


   return (
<>
   <div>
    <div className='flex pt-8 justify-center'>
            {/* FEEDS AREA  */}

            <div className=' w-screen flex justify-center'>
               <div className='bg-[#FFFFFF] w-[470px] rounded-lg shadow-md border mb-4'>
                  <div className='flex justify-between items-center'>
                     {/* NAME AND PROFILE PIC  */}
                     <Link to={userData.userName === user.userName?'/myprofile':`/profile/${user.userName}`}>
                     <div className='h-16  flex items-center'>
                        <img className=' rounded-full w-10 h-10 mx-3' src={PF+user.profilePic} alt='profile-pic' />
                        <div className='pr-4 '>
                           <p className='font-medium text-sm '>{user.fullName}</p>
                           <div className='flex gap-4 items-center'>
                              <p className='text-xs'>@{user.userName}</p>
                              <span className='text-gray-400 text-xs'>{format(post.createdAt)}</span>
                           </div>
                        </div>
                     </div></Link>

                     {/* NAME AND PROFILE PIC  END*/}

                     {/* SIDE DOT START  */}

                     <div className='pr-3 relative'>
                        <div>
                           <span onClick={()=>setShowDrop(!showDrop)} className='cursor-pointer'>
                              <BsThreeDotsVertical />
                           </span>
                         {showDrop &&  
                         <ul className='cursor-pointer dropdown-menu min-w-max absolute right-0 bg-white text-base z-50 float-left py-2 list-none
                               text-left rounded-lg shadow-lg mt-1 m-0 bg-clip-padding border-none'>
                                 {post.userId === userId ?
                                 <>
                              <li>
                              <span className='dropdown-item text-sm py-2 px-4 font-normal block w-full whitespace-nowrap
                                  bg-transparent text-gray-700 hover:bg-gray-100' onClick={()=>setDeleteModal(true)}>
                                    Delete
                              </span>
                              </li>
                              </> :
                              <>
                              <li>
                                 <span className='dropdown-item text-sm inline-flex items-center text-red-600 py-2 px-4 font-normal  w-full whitespace-nowrap
                                  bg-transparent  hover:bg-gray-100' onClick={()=>setShowModal(true)} >
                                    <BsFlagFill className="mr-2"/> Report
                                 </span>
                              </li>
                              </>
                                    }
                              <li>
                              <span className='dropdown-item text-sm py-2 px-4 font-normal block w-full whitespace-nowrap
                                  bg-transparent text-gray-700 hover:bg-gray-100' onClick={()=>setShowDrop(!showDrop)}>
                                    Cancel
                              </span>
                              </li>
                           </ul>}
                        </div>
                     </div>

                     {/* SIDE DOT END  */}
                  </div>
                  <div className='flex flex-col'>
                     <div className='flex mb-2 mx-3'>
                        <div>
                           <span className='text-sm'>
                              {post.description}
                              <br />
                              <br />
                           </span>
                        </div>
                     </div>
                  </div>
                  {/* POST AREA */}

                 {post.image && <div className='bg-slate-200  w-full h-[400px] flex justify-center'>
                     <img className='object-fill' src={PF + post.image} alt='post' />
                  </div>}
                  {/* POST AREA END*/}

                  <div className='flex flex-col'>
                     {/* LIKE AND COMMENT  */}

                     <div className='flex '>
                        <div className='flex justify-start gap-6 w-3/4 m-4'>
                           <div className='flex items-center gap-1'>
                              <span title='like' className=' text-gray-600 cursor-pointer' onClick={handleLike}>
                                 {likeState ? <FcLike className='text-lg ' /> : <FaRegHeart className='text-lg' />}
                              </span>
                              <span>{like}</span>
                           </div>
                                    
                           <div className='flex items-center gap-1'>
                              <span title='comment' className='text-gray-600' onClick={handleViewComment}>
                                 {React.createElement(FaRegComment, { size: 18 })}
                              </span>
                              <span>{allComments.length}</span>
                           </div>

                        </div>
                     </div>

                     {/* LIKE AND COMMENT END */}

                     {/* DESCRIPTION AREA  */}
                  </div>

                  <hr />
                  <div className=' px-6 py-2 max-h-[180px] overflow-y-auto no-scrollbar'>
                     {viewComment ? (
                        allComments?.map((comment, i) => {
                           return (
                              <div className='flex gap-3 my-2 items-center '>
                                 <div>
                                    <img className='w-8 rounded-full' src={profile} alt='profile' />
                                 </div>
                                 <div>
                                    <div>
                                       <span className='font-medium text-sm mr-2'>{comment.userId.userName}</span>
                                       <span className=''>{comment.comment}</span>
                                    </div>
                                    <p className='text-slate-500 text-xs '>{format(comment.createdAt)}</p>
                                 </div>
                              </div>
                           )
                        })
                     ) : (
                        <div className=''>
                           <form className='flex justify-between'>
                              <textarea
                                 name='comment'
                                 id='comment'
                                 rows='1'
                                 value={comment}
                                 onChange={handleSetComment}
                                 placeholder='Add your comments'
                                 className='w-3/4'
                              ></textarea>
                              <div>
                                 <button
                                    disabled={!comment}
                                    className='text-blue-500 disabled:opacity-50'
                                    onClick={handleComment}>
                                    Post
                                 </button>
                              </div>
                           </form>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            {/* FEEDS AREA END  */}
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
      {showModal ? (
  <>
    <div
      className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50  outline-none focus:outline-none"
    >
      <div className="relative w-auto my-6 mx-auto max-w-sm">
        {/*content*/}
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          {/*header*/}
          <div className="flex gap-3  justify-between items-center p-5 border-b border-solid border-slate-200 rounded-t">
            <h3 className="text-md text-black font-semibold inline">
               Why are you reporting this post?
            </h3>
            <button
              className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              onClick={() => setShowModal(false)}
            >
              <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                ×
              </span>
            </button>
          </div>
          {/*body*/}
            
              <div className='flex flex-col m-2 justify-center  gap-3 max-h-50 overflow-y-auto no-scrollbar'>
                  <div className="px-3">
                  <input type="radio" required className="mr-2" value="It's spam" name="reason" onChange={(e)=>setReason(e.target.value)} />
                  <label htmlFor="reason">It's spam</label> 
                  </div>
                  <div className="px-3">
                  <input type="radio" className="mr-2" name="reason" value="I just don't like it"  onChange={(e)=>setReason(e.target.value)}/>
                  <label htmlFor="reason">I just don't like it</label>     
                  </div>
                  <div className="px-3">
                  <input type="radio" className="mr-2" name="reason" value='false Information'  onChange={(e)=>setReason(e.target.value)}/>
                  <label htmlFor="reason">false Information</label>    
                  </div>  
                  <div className="px-3">
                  <input type="radio" className="mr-2" name="reason" value='Scam or Fraud'  onChange={(e)=>setReason(e.target.value)}/>
                  <label htmlFor="reason">Scam or Fraud</label>  
                  </div>   
                  <div className="px-3">
                  <input type="radio" className="mr-2" name="reason" value='Hate speech or symbols'  onChange={(e)=>setReason(e.target.value)}/>
                  <label htmlFor="reason">Hate speech or symbols</label>  
                  </div>   
              </div>
          {/*footer*/}
          <div className="flex items-center justify-end p-3 border-t border-solid border-slate-200 rounded-b">
            <button
              className="text-gray-500 background-transparent font-bold uppercase px-6  text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={() => setShowModal(false)}>
              Close
            </button>
            <button className="bg-cyan-600 hover:bg-red-400 text-white font-bold py-1 px-4 rounded inline-flex items-center disabled:bg-cyan-100"
             onClick={handleBlock} disabled={!reason}>
            <span>Submit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
  </>
) : null}

{deleteModal ? <div class=' flex-col space-y-4 min-w-screen h-screen animated fadeIn faster  fixed  left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none  bg-white bg-opacity-50'>
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
                        <div class='font-medium leading-none text-gray-100'>Delete Your Post ?</div>
                        <p class='text-sm text-gray-500 leading-none mt-1'>
                        By deleting your Post  you will lose your all data!
                        </p>
                     </div>
                  </div>
               </div>
               <div className='flex justify-center'>
                  <button
                     class='flex-no-shrink w-1/3 bg-green-500 px-5  ml-4 py-2 text-sm shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-green-500 text-white rounded-full'
                     onClick={() => setDeleteModal(false)}
                  >
                     Cancel
                  </button>
                  <button
                     class='flex-no-shrink w-1/3 bg-red-500 px-5  ml-4 py-2 text-sm shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-red-500 text-white rounded-full'
                     onClick={deletePost}
                  >
                     Delete
                  </button>
               </div>
            </div>
         </div>:null}
</>
   )
}

export default Post
