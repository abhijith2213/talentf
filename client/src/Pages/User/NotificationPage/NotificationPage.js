import React from "react";
import Bottombar from "../../../Components/User/NavigationBars/Bottombar.js/Bottombar";
import RightSidebar from "../../../Components/User/NavigationBars/RightSidebar/RightSidebar";
import Sidebar from "../../../Components/User/NavigationBars/UserSidebar/Sidebar";
import Notification from "../../../Components/User/Notification/Notification";

function NotificationPage() {
  return (
    <div className=' bg-[#F3F2EF] w-full min-h-screen'>
    <Sidebar/>
    <div className='w-full lg:w-11/12 flex justify-center pb-6 max-h-screen overflow-y-auto no-scrollbar'>
    <Notification/>
    </div>
    <RightSidebar/>
    <Bottombar/>
  </div>
  )
}

export default NotificationPage;
