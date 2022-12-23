import React from "react"
import Bottombar from "../../../Components/User/NavigationBars/Bottombar.js/Bottombar"
import Sidebar from "../../../Components/User/NavigationBars/UserSidebar/Sidebar"
import Notification from "../../../Components/User/Notification/Notification"

function NotificationPage() {
   return (
      <div className=' bg-[#F3F2EF] w-full min-h-screen max-h-screen overflow-y-auto no-scrollbar'>
         <Sidebar/>
         <div className='w-full lg:w-11/12 flex flex-col justify-center max-h-screen overflow-y-auto no-scrollbar'>
            <Notification/>
         </div>
         <Bottombar/>
      </div>
   )
}

export default NotificationPage
