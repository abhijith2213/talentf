
import React from "react";
import { useNavigate } from "react-router";
import error from '../../assets/images/lost404.png'
import {BiHomeAlt} from 'react-icons/bi'



function ErrorPage() {
    const navigate = useNavigate()
  return (
    
  <div className=" p-1 flex-col gap-2 lg:gap-0 lg:flex-row object-contain flex justify-center items-center relative h-screen bg-gradient-to-t lg:bg-gradient-to-r from-[#005aa7] to-[#fffde4]">
    <img className="h-2/3 lg:hidden" src={error} alt="" />
    <div className="flex flex-col items-center gap-5 max-w-xl ">
    <h2 className="font-bold  leading-tight text-white text-5xl lg:text-6xl text-center">This Page is Not on the Map </h2>
    <button type="button" onClick={()=>navigate(-1,{replace:true})} class="text-[#1da1f2] bg-white   focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 mr-2 mb-2">
        <BiHomeAlt/>
        Take me Back
    </button>
    </div>
    <img className="h-2/3 hidden lg:block" src={error} alt="" />
    
  </div>
  )
}

export default ErrorPage;
