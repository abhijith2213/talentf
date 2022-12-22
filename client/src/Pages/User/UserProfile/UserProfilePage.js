import React, { useState } from "react"
import Sidebar from "../../../Components/User/NavigationBars/UserSidebar/Sidebar"
import Bottombar from "../../../Components/User/NavigationBars/Bottombar.js/Bottombar"
import Profile from "../../../Components/User/UserProfile/Profile"

function UserProfilePage() {

   return (
      <div className=' bg-[#F3F2EF] flex w-full min-h-screen  md:pr-4 '>
         <Sidebar />
         <div className=' w-full flex justify-end '>
               <Profile />
         </div>
         <Bottombar />
      </div>
   )
}

export default UserProfilePage
