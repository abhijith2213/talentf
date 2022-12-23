import React from "react";
import { useSelector } from "react-redux";
import Sidebar from '../../../Components/User/NavigationBars/UserSidebar/Sidebar'
import Bottombar from '../../../Components/User/NavigationBars/Bottombar.js/Bottombar'
import Jobs from "../../../Components/User/Jobs/Jobs";
import JobRequests from "../../../Components/User/NavigationBars/RightSidebar/JobRequests";
import RightSidebar from '../../../Components/User/NavigationBars/RightSidebar/RightSidebar'


function JobsPage() {
  const userData = useSelector((state) => state.user)

  return (
    <div className ='bg-[#F3F2EF] w-full min-h-screen '>
      <Sidebar/>
      <div className ='w-full lg:max-h-screen flex justify-center pb-6 lg:pb-0 overflow-y-auto no-scrollbar'>
        <Jobs/>
      </div>
      {userData?.accountType === 'client'?
       <div className="hidden lg:block"><JobRequests/></div>
      : <div className="hidden lg:block"><RightSidebar/></div> }
      <Bottombar/>
    </div>
  )
}

export default JobsPage;
