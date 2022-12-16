
import React from "react";
import { useNavigate } from "react-router";
import error from '../../assets/images/errorpage.jpg'
import {BiHomeAlt} from 'react-icons/bi'



function ErrorPage() {
    const navigate = useNavigate()
  return (
    
  <div className="object-contain flex justify-center items-center relative">
    <img className="h-screen" src={error} alt="" />
    <div className="absolute bottom-5">
    <button type="button" onClick={()=>navigate('/home')} className="text-white bg-[#1da1f2] hover:bg-[#1da1f2]/90 focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 mr-2 mb-2">
        <BiHomeAlt/>
        Back to home
    </button>
    </div>
    
  </div>
  )
}

export default ErrorPage;
