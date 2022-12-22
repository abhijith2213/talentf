import React, { useState } from "react";
import {useDispatch, useSelector } from "react-redux"
import profile from "../../../assets/images/download.png"
import { Link } from "react-router-dom";

import { ToastContainer, toast } from 'react-toastify';  //Toast
import 'react-toastify/dist/ReactToastify.css';  //Toast Css


import {HiOutlineEye, HiOutlineEyeOff} from 'react-icons/hi'

import { changePassword, setProfilePicture, updateUserProfile } from "../../../Apis/userRequests";
import { update, setProfilePic } from "../../../Redux/User/userSlice";
import { useErrorHandler } from "react-error-boundary";

function EditProfile() {

  const PF = process.env.REACT_APP_PUBLIC_FOLDER
  const handleError = useErrorHandler()
    const dispatch = useDispatch();
    const userData = useSelector(state =>state.user)

    const [Select, setSelect ]= useState(true)

    const [showModal,setShowModal] = useState(false)

    
    const initialValues ={...userData}
    const [newProfile, setNewProfile] = useState(initialValues)
    
    const [profilePic, setProPic] = useState('')
    const [showImage,setShowImage] = useState('')
    const [modal,setModal]=useState(false)
    
    /* ------------------------------ EDIT DETAILS ------------------------------ */

    const handleChange =(e)=>{
      const {name,value}= e.target;
      setNewProfile({...newProfile,[name]:value})
    }

    const handleSubmit =async (e)=>{
      e.preventDefault()
      try {
        const {data} = await updateUserProfile(userData._id,newProfile)
        if(data){
          dispatch(update(newProfile))
          localStorage.setItem("user",JSON.stringify(newProfile))
          toast.success(data.message)
        }
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
    /* ----------------------- UPLOAD NEW PROFILE PICTURE ----------------------- */



    // HANDLE IMAGE CHANGE 

    const handleImage =(e)=>{
      setShowImage(URL.createObjectURL(e.target.files[0]))
      setProPic(e.target.files[0])
      setModal(true)
   }

  //  MAKE CHANGES 

    const handleNewProfilePic =async (e) =>{
      let datas
      if(profilePic){
                datas = new FormData()
                datas.append('file',profilePic)
                datas.append('userId',userData._id)
                try {
                  const {data} = await setProfilePicture(datas)
                    if(data.message){
                    localStorage.setItem("profilePic",JSON.stringify(data.image))
                    dispatch(setProfilePic({profilePic:data.image}))
                    toast.success(data.message)
                 setModal(false)
                 setShowModal(false)
                }
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
      }

      /* ----------------------------- CHANGE PASSWORD ---------------------------- */
      const passRegex ='/^(?=.*[a-zA-Z]).{8,12}$/'
      const initial = {oldPass:'',newPass:'',confirmNewPass:''}
      const [password,setPassword] = useState(initial)
      const [passError, setPassError] = useState('')
      
      const handlePassChange =(e)=>{
        const {name,value} = e.target
        setPassword({...password, [name]:value})
      }
      
      const handleSubmitPassword =async (e)=>{
        e.preventDefault()
        if(password.newPass.length < 8 ||password.newPass.length > 12){
          setPassError('password must be 8-12 characters!')
        }else if(password.newPass !== password.confirmNewPass){
          setPassError('new password and confirmpassword not match!')
        }else{
          setPassError('')
          try {
            const {data} = await changePassword(userData._id,password)
            setPassword(initial)
            toast.success(data.message)
          } catch (error) {
            if(error.response.status === 401){
              setPassError(error.response.data.message)
            }
            if (!error?.response?.data?.auth && error?.response?.status === 403) {
              localStorage.removeItem('userToken')
              localStorage.removeItem('user')
              navigate("/signin")
           }else{
              handleError(error)
           }
          }
        }
      }
      
      /* ------------------------- CHANGE PASS INPUT TYPE ------------------------- */
      const [inputType,setInputType] = useState('password')
      
      const handleInputType =(e)=>{
        if(inputType==="password")
        {
          setInputType("text")
         return;
        }
        setInputType("password")
      }
      


  return (
    <>
    <div className='w-full  mt-10 sm:mt-16 sm:mx-4 md:mt-0 md:w-5/6  lg:w-3/4 lg:flex lg:justify-end bg-[#F3F2EF] max-h-screen overflow-y-auto no-scrollbar'>
    <div className="h-full w-full ">
 
    <div className="border-b-2 block md:flex h-full py-10">
   <div className="w-full md:w-1/4 p-4 sm:p-6 lg:p-8 bg-white shadow-md">
        <h2 className="text-xl mb-4 font-medium text-blue-500">EDIT PROFILE</h2>
     <div className="flex flex-col gap-4">
       <h2 className={Select?'bg-blue-400 text-white px-2 rounded-md cursor-pointer text-lg':"cursor-pointer text-lg"} onClick={()=>setSelect(true)}>Edit Details</h2>
          <h2 className={!Select?'bg-blue-400 text-white px-2 rounded-md cursor-pointer text-lg':"cursor-pointer text-lg"} onClick={()=>setSelect(false)}>Change password</h2>
     </div>
   </div>
   
  {Select ? 
   <div className="w-full md:w-3/4 p-8 bg-white lg:ml-4 shadow-md">
     <div className="rounded  shadow p-6">
       <div className="pb-6">
        <div className="flex items-center gap-6 mb-2">
        <img id="showImage" className="max-w-xs w-24 h-24 items-center border rounded-full" src={userData?.profilePic? PF+userData.profilePic : profile} alt=""/>
        <div className="block">
        <label for="name" className="font-semibold text-gray-700 block pb-1 text-xl">{userData.userName}</label>
        <label for="name" className="font-semibold text-blue-400 block pb-1" onClick={(e)=>setShowModal(true)}>Change Profile Photo</label>
        </div>                                  
        </div>
         <div className="mb-2">
            <label for="fullName" className="font-semibold text-gray-700 block pb-1">Full Name</label>
           <input  name="fullName" 
           className="border rounded focus:outline-none rounded-r px-4 py-2 w-full" type="text"
            value={newProfile?.fullName} onChange={handleChange} />
         </div>
         <div className="mb-2">
            <label for="userName" className="font-semibold text-gray-700 block pb-1">user Name</label>
           <input  name="userName" 
           className="border rounded focus:outline-none rounded-r px-4 py-2 w-full" type="text"
             value={newProfile?.userName}  onChange={handleChange} />
         </div>
         <div className="mb-2">
           <label for="bio" className="font-semibold text-gray-700 block pb-1">About You</label>
           <textarea  name="about"
           className="border rounded focus:outline-none rounded-r px-4 py-2 w-full" type="text"
             value={newProfile?.about}  onChange={handleChange} />
         </div>
       <button type="button" 
       className="text-white bg-blue-600  hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 "
       onClick={handleSubmit}>Submit</button>
       </div>
     </div>
   </div>
   :
   <div className="w-full md:w-3/4 p-8 bg-white lg:ml-4 shadow-md ">
   <div className="rounded  shadow p-6">
     <div className="pb-6">
      <div className="flex items-center gap-6 mb-2">
      <img id="showImage" className="max-w-xs w-24 h-24 items-center border rounded-full" src={ PF+userData?.profilePic } alt=""/>
      <div className="block">
      <label for="name" className="font-semibold text-gray-700 block pb-1 text-2xl">{userData?.userName}</label>
      </div>                                  
      </div>
          <label for="oldPassword" className="font-semibold text-gray-700 block pb-1">Old Password</label>
       <div className="mb-2 flex relative  items-center">
         <input  name="oldPass" className="border rounded focus:outline-none rounded-r px-4 py-2 w-full" 
         type={inputType} value={password.oldPass} onChange={handlePassChange}/>
          <button className="absolute right-4" onClick={handleInputType}>
          { inputType==="password"?<HiOutlineEyeOff/>:<HiOutlineEye/>}
          </button>
       </div>
       <div className="mb-2">
          <label for="userName" className="font-semibold text-gray-700 block pb-1">New Password</label>
         <input  name="newPass" className="border rounded focus:outline-none rounded-r px-4 py-2 w-full"
          type="password" pattern="/^(?=.*[a-zA-Z]).{8,12}$/"  value={password.newPass} onChange={handlePassChange}/>
       </div>
       <div className="">
          <label for="userName" className="font-semibold text-gray-700 block pb-1">Confirm New Password</label>
         <input  name="confirmNewPass" className="border rounded focus:outline-none rounded-r px-4 py-2 w-full" 
         type='password' value={password.confirmNewPass} onChange={handlePassChange} />

       </div>
     </div>
     {passError && <p className="text-red-600 mb-2">{passError}</p>}
     <button type="button" 
     className="text-white bg-blue-500  hover:bg-blue-600 focus:ring-4 block focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 "
     onClick={handleSubmitPassword}>Change Password</button>
     <Link to={'/forgotPassword'}><span className="text-blue-400 cursor-pointer">Forgotten your Password?</span></Link>
   </div>
 </div>
}

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
  {/* change profile pic modal  */}
  {showModal ?  <>
    <div
      className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50  outline-none focus:outline-none"
    >
      <div className="relative w-auto my-6 mx-auto max-w-sm">
        {/*content*/}
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
        <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
            <h3 className="text-xl font-semibold">
              Change Profile Photo
            </h3>

          </div>
          {/*body*/}

          <div className="flex cursor-pointer  items-center justify-center p-3 border-t border-solid border-slate-200 rounded-b">
                 {/* <p className='font-medium text-sm text-red-500' onClick={removeProfilePic}>Remove Current Profile Pic</p> */}
         </div>
         <div className="flex cursor-pointer  items-center justify-center p-3 border-t border-solid border-slate-200 rounded-b" onClick={handleNewProfilePic}>
         <label htmlFor="img-upload" className="cursor-pointer">
                 <p className='font-medium text-sm' >Upload New Photo</p>
          </label>  
                 <input type="file" name="profile" id="img-upload" onChange={handleImage}  className="hidden"/>
            </div>
          <div className="flex cursor-pointer  items-center justify-center p-3 border-t border-solid border-slate-200 rounded-b">
            <button className="text-gray-700 text-center background-transparent font-medium  px-6  text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
  </> : null}


          {modal ? <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
              >
            <div className="relative w-auto my-6 mx-auto max-w-lg">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Update Profile Picture
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setModal(false)}>
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative px-6 flex gap-2 items-center justify-center p-6">
                    <img className="rounded-full w-20 h-20" src={showImage} alt="" />
                    <div>
                    <p className="text-xl">{userData.fullName}</p>
                    <p className="text-lg text-gray-400 ml-2 ">{userData.userName}</p>
                    </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end px-6 py-2 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-blue-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-green-500 text-white active:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={ handleNewProfilePic}>
                    Save change
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>:null}
  </>
  )
}

export default EditProfile;
