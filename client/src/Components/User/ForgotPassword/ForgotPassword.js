import React, { useState } from "react"
import { Link } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css" //Toast Css
import LoadingOverlay from 'react-loading-overlay-ts';
import HashLoader from "react-spinners/HashLoader"

import { forgotPass } from "../../../Apis/userRequests"

import fpass from "../../../assets/images/fpassword.jpg"
import logo from "../../../assets/images/talentF-c.png"
function ForgotPassword() {
   const [email, setEmail] = useState("")

   const [loader,setLoader] = useState(false)

   const handleSendLink = async () => {
    setLoader(true)
      try {
         const { data } = await forgotPass(email)
         setLoader(false)
         if (data.status) {
            toast.success(data.message)
         }
      } catch (error) {
        setLoader(false)
         if (error.response.status === 403) {
            toast.warn(error.response.data.message)
         }
         console.log(error)
      }
   }

   return (
      <div className='container mx-auto'>
         <div className='flex justify-center px-6 my-12'>
            <div className='w-full xl:w-3/4 lg:w-11/12 flex'>
               <div className='w-full h-auto bg-gray-400 hidden lg:block lg:w-1/2 bg-cover rounded-l-lg'
                  style={{ backgroundImage: `url(${fpass})` }}
               ></div>
               <div className='w-full lg:w-1/2 bg-white p-5 rounded-lg lg:rounded-l-none'>
                  <div className='px-8 mb-4 text-center'>
                     <img src={logo} className='w-40 inline-block' alt='logo' />
                     <h3 className='pt-4 mb-2 text-2xl'>Forgot Your Password?</h3>
                     <p className='mb-4 text-sm text-gray-700'>
                        We get it, stuff happens. Just enter your email address below and we'll send you a link to reset
                        your password!
                     </p>
                  </div>
                  <form className='px-8 pt-6 pb-8 mb-4 bg-white rounded'>
                     <div className='mb-4'>
                        <label className='block mb-2 text-sm font-bold text-gray-700' for='email'>
                           Email
                        </label>
                        <input
                           className='w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
                           id='email'
                           type='email'
                           onChange={(e) => setEmail(e.target.value)}
                           placeholder='Enter Email Address...'
                        />
                     </div>
                     <div className='mb-6 text-center'>
                        <button
                           className='w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline'
                           type='button'
                           onClick={handleSendLink}
                        >
                           Send Link
                        </button>
                     </div>
                     <hr className='mb-6 border-t' />
                     <div className='text-center'>
                        <Link to={"/create_account"}>
                           <a className='inline-block text-sm text-blue-500 align-baseline hover:text-blue-800'>
                              Create an Account!
                           </a>
                        </Link>
                     </div>
                     <div className='text-center'>
                        <Link to={"/signin"}>
                           <a className='inline-block text-sm text-blue-500 align-baseline hover:text-blue-800'>
                              Already have an account? Login!
                           </a>
                        </Link>
                     </div>
                  </form>
               </div>
            </div>
         {/* SPINNER  */}
         {loader ? ( <div className='absolute w-full h-full backdrop-blur-sm  flex items-center justify-center'>
               <LoadingOverlay active={loader} spinner={<HashLoader color={"#146CF0"} />} text='Please Wait...!'>
               </LoadingOverlay>
                  <ToastContainer
                     position='top-center'
                     autoClose={3000}
                     hideProgressBar
                     newestOnTop
                     closeOnClick
                     rtl={false}
                     pauseOnFocusLoss={false}
                     draggable
                     theme='dark'/>
            </div>
         ) : (
            ""
         )}
         </div>
      </div>
   )
}

export default ForgotPassword
