import React, { useState, useEffect } from "react"
import { getUser } from "../../../Apis/userRequests"

function Conversation({ data, currentUserId, online }) {

   const PF = process.env.REACT_APP_PUBLIC_FOLDER
  console.log(data,'conversation dataa');
   const [userData, setUserData] = useState(null)

   useEffect(() => {
      const userId = data.members.find((id) => id !== currentUserId)
      const getUserData = async () => {
         try {
            const { data } = await getUser(userId)
            setUserData(data)
         } catch (error) {
            console.log(error)
         }
      }
      getUserData()
   }, [])



   return (
      <div>
         <a className='flex items-center px-3 py-2 text-sm transition duration-150  ease-in-out border-b border-gray-300 cursor-pointer hover:bg-gray-100 focus:outline-none'>
            <img className='object-cover w-10 h-10 rounded-full' src={PF + userData?.profilePic} alt='username' />
            <div className='w-full pb-2'>
               <div className='flex justify-between'>
                  <span className='block ml-2 font-semibold text-gray-600'>{userData?.userName}</span>
                  {/* <span className="block ml-2 text-sm text-gray-600">25 minutes</span> */}
               </div>
               {online && <span className='block ml-2 text-sm text-green-400'>online</span>}
            </div>
         </a> 
      </div>
   )
}

export default Conversation
