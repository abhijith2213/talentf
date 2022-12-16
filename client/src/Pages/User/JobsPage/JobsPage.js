import React from "react";
import { useSelector } from "react-redux";
import Sidebar from '../../../Components/User/NavigationBars/UserSidebar/Sidebar'
import Bottombar from '../../../Components/User/NavigationBars/Bottombar.js/Bottombar'
import Jobs from "../../../Components/User/Jobs/Jobs";
import JobRequests from "../../../Components/User/NavigationBars/RightSidebar/JobRequests";
import RightSidebar from '../../../Components/User/NavigationBars/RightSidebar/RightSidebar'
import { ErrorBoundary } from "react-error-boundary"
import fallbackPage from "../../../Components/ErrorBoundary/fallbackPage";


function JobsPage() {
  const userData = useSelector((state) => state.user)

  const errorHandler = (error, errorInfo) => {
    console.log(error);
 }

  return (
    <div className ='bg-[#F3F2EF] w-full min-h-screen '>
      <Sidebar/>
      <div className ='w-full lg:max-h-screen flex justify-center pb-6 lg:pb-0 overflow-y-auto no-scrollbar'>
      <ErrorBoundary FallbackComponent={fallbackPage} onError={errorHandler} onReset={() => {}}>
        <Jobs/>
      </ErrorBoundary>
      </div>
      {userData?.accountType === 'client'?
      <JobRequests/>
      :<RightSidebar/>}
      <Bottombar/>
    </div>
  )
}

export default JobsPage;
