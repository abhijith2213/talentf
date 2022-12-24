import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { updateNewPass } from "../../../Apis/userRequests";
import { toast,ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css" //Toast Css

import fpass from "../../../assets/images/fpassword.jpg"
import logo from "../../../assets/images/talentF-c.png"
import { useErrorHandler } from "react-error-boundary";


function ResetPassword() {
   const navigate = useNavigate()
      const handleError = useErrorHandler()
    const [newPass, setNewPass] = useState('')
    const [newCPass, setCNewPass] = useState('')
    const [error, setError] = useState('')

    const {email,otp}  = useParams()

    const handleReset =async(e)=>{
        e.preventDefault()
        if(newPass.length < 8 || newPass.length >15){
         setError('password must be in betweeb 8 to 15 letters')
        }else{
        if(newPass === newCPass){
            setError('')
            try {
                const {data} = await updateNewPass(newPass,email,otp)
                toast.success(data.message)
                setTimeout(() => {     
                  navigate('/signin')
               }, 2000);
            } catch (error) {
               toast.warn(error.response.data.message)
            }
        }else{
            setError('Passwords doesnt match')
        }
      }
    }

  return (
    <div className='container mx-auto'>
         <div className='flex justify-center px-6 my-12'>
            <div className='w-full xl:w-3/4 lg:w-11/12 flex'>
               <div
                  className='w-full h-auto bg-gray-400 hidden lg:block lg:w-1/2 bg-cover rounded-l-lg'
                  style={{ backgroundImage: `url(${fpass})` }}
               ></div>
               <div className='w-full lg:w-1/2 bg-white p-5 rounded-lg lg:rounded-l-none'>
                  <div className='px-8 mb-4 text-center'>
                  <img src={logo} className='w-40 inline-block' alt="logo"/>
                     <h3 className='pt-4 mb-2 text-2xl'>Forgot Your Password?</h3>
                     <p className='mb-4 text-sm text-gray-700'>
                        change your password here. You can use it for further login process..
                     </p>
                  </div>
                  <form className='px-8 pt-6 pb-8 mb-4 bg-white rounded'>
                        <div className='mb-4'>
                            <div className="mb-6">
                           <label className='block mb-2 text-sm font-bold text-gray-700' for='email'>
                              New Password
                           </label>
                           <input
                              className='w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
                              name="newPass"
                              type='password'
                              onChange={(e)=>setNewPass(e.target.value)}
                              placeholder='Enter New Password...'
                           />
                            </div>
                            <div className="mb-6">
                           <label className='block mb-2 text-sm font-bold text-gray-700' for='email'>
                              Confirm New Password
                           </label>
                           <input
                              className='w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
                              type='password'
                              name="newCPass"
                              onChange={(e)=>setCNewPass(e.target.value)}
                              placeholder='Confirm new password...'
                           />
                            </div>
                        {error && <p className="p-2 text-red-600">{error}</p>}
                        </div>
                     <div className='mb-6 text-center'>
                           <button
                              className='w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline'
                              onClick={handleReset}>
                              Reset Password
                           </button>
                     </div>
                     <hr className='mb-6 border-t' />
                  </form>
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
      </div>
  )
}

export default ResetPassword;
