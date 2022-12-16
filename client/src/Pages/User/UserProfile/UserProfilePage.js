import React, { useState } from "react"
import Sidebar from "../../../Components/User/NavigationBars/UserSidebar/Sidebar"
import Bottombar from "../../../Components/User/NavigationBars/Bottombar.js/Bottombar"
import Profile from "../../../Components/User/UserProfile/Profile"
import { ErrorBoundary } from "react-error-boundary"
import fallbackPage from "../../../Components/ErrorBoundary/fallbackPage"

function UserProfilePage() {
   const [error, setError] = useState("")
   const errorHandler = (error, errorInfo) => {
      setError(error)
   }
   return (
      <div className=' bg-[#F3F2EF] flex w-full min-h-screen  md:pr-4 '>
         <Sidebar />
         <div className=' w-full flex justify-end '>
            <ErrorBoundary FallbackComponent={fallbackPage} onError={errorHandler} onReset={() => {}}>
               <Profile />
            </ErrorBoundary>
         </div>
         <Bottombar />
      </div>
   )
}

export default UserProfilePage
