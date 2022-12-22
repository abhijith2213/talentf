import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import OTPInput from "otp-input-react"
import Countdown from "react-countdown"
import LoadingOverlay from 'react-loading-overlay-ts';
import HashLoader from "react-spinners/HashLoader"

import axios from "../../../Axios/axios"
import loginImg from "../../../assets/images/4204968.jpg"
import logo from "../../../assets/images/talentF-c.png"
import { resendOtpCall, sendOtp, validateOtp } from "../../../Apis/userRequests"

import { ToastContainer, toast } from "react-toastify" //Toast
import "react-toastify/dist/ReactToastify.css" //Toast Css
import { useErrorHandler } from "react-error-boundary"

function SignUp() {
   const navigate = useNavigate()
   const handleError = useErrorHandler()
   const [formvalues, setFormValues] = useState()

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm()

   const [formError, setFormError] = useState("")

   /* ----------------------------------- OTP ---------------------------------- */

   const [otp, setOtp] = useState()
   const [otpError, setOtpError] = useState("")
   
   const [otpModal, setOtpModal] = useState(false)
   const [resend, setResend] = useState(false)

   const [loader,setLoader] = useState(false)
   const [isActive,setIsActive] = useState(false)

   const onSubmit = async (formData) => {
      setFormValues(formData)
      setLoader(true)
      setIsActive(!isActive)
      try {
         const { data } = await sendOtp(formData)
         setLoader(false)
         setIsActive(!isActive)
         if (data.status) {
            setOtpModal(true)
            toast.success(data.message)
            setTimeout(() => {
               setResend(true)
            }, "60000")
         } else {
            toast.warn('otp not send failure')
         }
      } catch (error) {
         setFormError(error.response.data.message)
      }
   }

   const handleSignUp = async (e) => {
      e.preventDefault()

      if (otp.length < 6) {
         setOtpError("Provide a 6 digit OTP")
      } else {
         const details = {
            otp: otp,
            email: formvalues.email,
         }
         setOtp("")
         try {
            const { data } = await validateOtp(details)
            if (data.auth) {
               setOtpModal(false)
               try {
                  axios
                     .post("/create_account", formvalues)
                     .then((res) => {
                        navigate("/signin")
                     })
                     .catch((err) => {
                        setFormError(err.data.message)
                     })
               } catch (error) {
                  console.log(error, "oooii")
               }
            } else {
               toast.warn("enter a valid otp")
            }
         } catch (error) {
            if (error.response.status === 403) {
               toast.warn(error.response.data.message)
            }else{
               handleError(error)
            }
            
         }
      }
   }

   /* ------------------------------- RESEND OTP ------------------------------- */

   const resendOtp = async () => {
      setOtp("")

      try {
         const { data } = await resendOtpCall(formvalues.email)
         if (data.status) {
            toast.success(data.message)
            setResend(false)
            setTimeout(() => {
               setResend(true)
            }, "60000")
         }
      } catch (error) {
         handleError(error)

      }
   }

   return (
      <>
         <section className='bg-white-50 min-h-screen flex items-center justify-center'>
            <div className='bg-white-100 flex rounded-2xl shadow-lg max-w-3xl p-5 items-center'>
               <div className='md:block hidden w-1/2 '>
                  <div className='flex justify-center '>
                     <img src={logo} className='w-40' alt='logo' />
                  </div>
                  <img className='rounded-2xl' src={loginImg} />
               </div>

               <div className='md:w-1/2 px-8 md:px-16'>
                  <div className='w-full mb-4 flex justify-center'>
                     <img src={logo} className='w-36 md:hidden ' alt='logo' />
                  </div>

                  <h2 className='font-bold text-2xl text-[#002D74] pb-5'>Create Account</h2>

                  <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                     <div className='relative'>
                        <input
                           className='peer p-2  rounded-xl border   w-full placeholder-transparent text-gray-500 focus:outline-none'
                           type='text'
                           name='fullName'
                           {...register("fullName", {
                              required: "full name is required",
                              pattern: { value: /(?=^.{0,40}$)^[a-zA-Z-]+\s[a-zA-Z-]+$/, message: "Provide Full Name" },
                           })}
                           placeholder='fullname'
                        />
                        <label
                           htmlFor='fullname'
                           className='absolute -top-3 left-4  text-gray-800 transition-all  
                  peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2
                  peer-focus:-top-3 peer-focus:text-gray-500 '
                        >
                           Full Name*
                        </label>
                        <p className='text-sm text-red-700'>{errors.fullName?.message}</p>
                     </div>

                     <div className='relative'>
                        <input
                           className='peer p-2  rounded-xl border focus:outline-none  w-full placeholder-transparent text-gray-500'
                           type='text'
                           name='userName'
                           {...register("userName", {
                              required: "User Name is required",
                              pattern: { value: /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/, message: "invalid userName" },
                           })}
                           placeholder='username '
                        />
                        <label
                           htmlFor='userName'
                           className='absolute -top-3 left-4  text-gray-800 transition-all  
                  peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2
                  peer-focus:-top-3 peer-focus:text-gray-500 '
                        >
                           userName*
                        </label>
                        <p className='text-sm text-red-700'>{errors.userName?.message}</p>
                     </div>

                     <div className='relative'>
                        <input
                           className='peer p-2 rounded-xl border w-full focus:outline-none placeholder-transparent text-gray-500'
                           type='email'
                           name='email'
                           {...register("email", {
                              required: "email is required",
                              pattern: {
                                 value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                                 message: "invalid email ",
                              },
                           })}
                           placeholder='Email'
                        />
                        <label
                           htmlFor='email'
                           className='absolute left-4 -top-3  text-gray-500 transition-all  
                  peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2
                  peer-focus:-top-3 peer-focus:text-gray-500 '
                        >
                           Email*
                        </label>
                        <p className='text-sm text-red-700'>{errors.email?.message}</p>
                     </div>
                     <div className='relative'>
                        <input
                           className='peer p-2 rounded-xl  focus:outline-none w-full placeholder-transparent text-gray-500'
                           type='number'
                           name='phone'
                           {...register("phone", {
                              required: "phone number required",
                              pattern: { value: /^(\+\d{1,3}[- ]?)?\d{10}$/, message: "invalid Phone number format " },
                           })}
                           placeholder='Phone'
                        />
                        <label
                           htmlFor='phone'
                           className='absolute -top-3 left-4  text-gray-500 transition-all  
                  peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2
                  peer-focus:-top-3 peer-focus:text-gray-500 '
                        >
                           Phone*
                        </label>
                        <p className='text-sm text-red-700'>{errors?.phone?.message}</p>
                     </div>
                     <div className='relative'>
                        <input
                           className='peer p-2 rounded-xl border focus:outline-none w-full placeholder-transparent text-gray-500'
                           type='password'
                           name='password'
                           {...register("password", {
                              required: "password is required",
                              pattern: {
                                 value: /^(?=.*[a-zA-Z]).{8,12}$/,
                                 message: "password must be 6 to 14 characters ",
                              },
                           })}
                           placeholder='Password'
                        />
                        <label
                           htmlFor='password'
                           className='absolute -top-3 left-4  text-gray-500 transition-all  
                  peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2
                  peer-focus:-top-3 peer-focus:text-gray-500 '
                        >
                           Password*
                        </label>
                        <p className='text-sm text-red-700'>{errors?.password?.message}</p>
                     </div>
                     <label htmlFor='account-type' className='text-gray-500'>
                        Account Type
                     </label>
                     <div className='flex justify-between '>
                        <div className='mr-2'>
                           <input
                              type='radio'
                              name='accountType'
                              className='mr-1'
                              {...register("accountType", { required: "Select any accoun type" })}
                              value='client'
                           />
                           <span className='text-gray-500'>Client, hiring for project</span>
                        </div>
                        <div>
                           <input
                              type='radio'
                              name='accountType'
                              className='mr-1'
                              {...register("accountType", { required: "Select any accoun type" })}
                              value='freelancer'
                           />
                           <span className='text-gray-500'>Freelancer looking for job</span>
                        </div>
                     </div>
                     <p className='text-sm text-red-700'>{errors?.accountType?.message}</p>
                     {formError && (
                        <p className='text-sm text-red-700 rounded-lg' role='alert'>
                           {formError}
                        </p>
                     )}
                     <button className='bg-[#002D74] rounded-xl text-white py-2 hover:scale-105 duration-300'>
                        Signup
                     </button>
                  </form>

                  <div className='mt-2 text-xs flex justify-between items-center text-[#002D74]'>
                     <p>Already have an account?</p>
                     <Link to={"/signin"}>
                        <button className='py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300'>
                           Login
                        </button>
                     </Link>
                  </div>
               </div>
            </div>
            {/* OTP MODAL  */}

            {otpModal ? (
               <div className='h-screen w-full bg-white bg-opacity-50 py-20 px-3 absolute'>
                  <div className='container mx-auto '>
                     <div className='max-w-sm mx-auto md:max-w-lg '>
                        <div className='w-full '>
                           <div className='bg-blue-500 h-64 py-3 rounded text-center relative'>
                              <span
                                 className='absolute right-5 text-black font-semibold cursor-pointer'
                                 onClick={() => setOtpModal(false)}
                              >
                                 X
                              </span>
                              <h1 className='text-2xl font-bold text-white'>OTP Verification</h1>
                              <div className='flex flex-col mt-4 text-white'>
                                 <span>Enter the OTP you received at Gmail</span>
                                 {/* <span className='font-bold'>+91 ******876</span> */}
                              </div>

                              <div id='otp' className='flex flex-row justify-center text-center px-2 mt-5'>
                                 <OTPInput
                                    value={otp}
                                    onChange={setOtp}
                                    autoFocus
                                    OTPLength={6}
                                    otpType='number'
                                    disabled={false}
                                 />
                              </div>

                              <div className=' flex justify-center pt-2'>
                                 {resend ? (
                                    <button
                                       className='flex items-center mt-4 text-gray-600 cursor-pointer font-bold bg-slate-300 rounded-lg pl-2 pr-2 '
                                       onClick={resendOtp}
                                    >
                                       Resend OTP
                                    </button>
                                 ) : (
                                    <Countdown date={Date.now() + 60000} />
                                 )}
                              </div>

                              <div className='flex justify-center text-center mt-5'>
                                 <a className='flex items-center text-blue-700 hover:text-blue-900 cursor-pointer'>
                                    <button
                                       className='font-bold rounded-md bg-green-500 text-zinc-50 px-2'
                                       onClick={handleSignUp}
                                    >
                                       Verify OTP
                                    </button>
                                    <i className='bx bx-caret-right ml-1'></i>
                                 </a>
                              </div>
                              <div className='flex w-full justify-center items-center'></div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            ) : null}
         {/* SPINNER  */}
         {loader ? (
            <div className=' absolute w-full h-full backdrop-blur-sm  flex items-center justify-center'>
               <LoadingOverlay active={isActive} spinner={<HashLoader color={'#146CF0'}/>} text='Please Wait !'>
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
               </LoadingOverlay>
            </div>
         ) : (
            ""
         )}
         </section>


      </>
   )
}

export default SignUp
