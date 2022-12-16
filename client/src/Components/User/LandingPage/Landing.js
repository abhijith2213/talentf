import React,{useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from '../../../assets/images/talentF-c.png'

/* ------------------------------ IMAGES IMPORT ----------------------------- */

import Bg from "../../../assets/images/18771.jpg";
import Bg2 from "../../../assets/images/man-working87.webp";
import Bg3 from "../../../assets/images/freelance-work_set-04.jpg"


function Landing() {

  const navigate = useNavigate()


  useEffect(()=>{
    const token = localStorage.getItem('userToken')
    if(token){
      navigate('/home')
    }
  },[])

  return (
    <>
      
      <div className="flex justify-between  border">
        {/* <h2 className="m-6 font-bold text-2xl md:text-4xl text-blue-400">{logo}</h2> */}
        <img src={logo} className='w-32 h-8 md:w-40 md:h-10 m-4' alt="logo" />
        <Link to={'/signin'}>
        <button type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium m-5
            rounded-full text-sm px-5 md:text-xl py-1 text-center   dark:bg-blue-500 dark:hover:bg-blue-700 dark:focus:ring-blue-600 ">
            Login  </button></Link>
      </div>
      <div className="items-center max-w-md sm:max-w-2xl sm:mt-6 px-6 py-6 mx-auto grid md:grid-cols-2 md:max-w-3xl md:mt-8 lg:max-w-6xl ">
        <div>
          <h2 className="font-bold text-blue-500 text-4xl sm:text-5xl lg:text-6xl">
            How work <br /> should work
          </h2>
          <p className="mt-5 sm:mt-7 text-lg sm:text-2xl lg:text-3xl font-medium text-gray-600">
            You can have best people for your work Right now, Right here
          </p>

          <Link to={'/create_account'}> 
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium
                sm:text-2xl sm:mt-8 rounded-full text-sm px-5 py-2.5 text-center mt-4 mr-2 mb-2 dark:bg-blue-500 dark:hover:bg-blue-700 dark:focus:ring-blue-600 lg:mt-10"
          >
            Get Started
          </button></Link>
        </div>
        <div>
          <img className="md:max-w-full" src={Bg} alt="background" />
        </div>
      </div>

      <div className="items-center max-w-md sm:max-w-2xl sm:mt-6 px-6 py-6 mx-auto grid md:grid-cols-2 md:max-w-3xl md:mt-8 lg:max-w-6xl">
        <div>
          <img hidden className="sm:mt-4 md:block" src={Bg2} alt="background" />
        </div>
        <div className="lg:text-right">
          <h2 className="font-bold text-slate-400 text-3xl sm:text-5xl">
            Looking For Job?
          </h2>
          <p className="mt-5 text-lg sm:text-2xl font-medium text-gray-500">
            Register as Freelancer, Get Hired
          </p>
          <Link to={'/create_account'}>
          <button
            hidden
            type="button"
            className="text-white  bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium
                rounded-full float-right text-2xl px-5 py-2.5 text-center mt-10 mr-2 mb-2 dark:bg-blue-500 dark:hover:bg-blue-700 dark:focus:ring-blue-600  md:block"
          >
            Join Now
          </button></Link>
        </div>
        <div>
          <img className="sm:mt-4 md:hidden" src={Bg2} alt="background" />
        </div>
        
      </div>


      <div className="items-center max-w-md sm:max-w-2xl sm:mt-6 px-6 py-6 mx-auto grid md:grid-cols-2 md:max-w-3xl md:mt-8 lg:max-w-6xl">
        
        <div className="">
          <h2 className="font-bold text-blue-500 text-3xl sm:text-5xl">
            Find Great Talents!
          </h2>
          <p className="mt-5 text-lg sm:text-2xl font-medium text-gray-500">
          Work with the largest network of independent professionals and get things done
          </p>
          <Link to={'/create_account'}>
          <button
            hidden
            type="button"
            className="text-white  bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium
                rounded-full  text-2xl px-5 py-2.5 text-center mt-10 mr-2 mb-2 dark:bg-blue-500 dark:hover:bg-blue-700 dark:focus:ring-blue-600  md:block"
          >Hire Now
          </button></Link>
        </div>
        <div>
          <img  className="sm:mt-4 " src={Bg3} alt="background" />
        </div>
        
      </div>
    </>
  );
}

export default Landing;
