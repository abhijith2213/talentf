import React from 'react'
import Home from '../../../Components/User/Home/Home'
import Sidebar from '../../../Components/User/NavigationBars/UserSidebar/Sidebar'
import RightSidebar from '../../../Components/User/NavigationBars/RightSidebar/RightSidebar'
import Bottombar from '../../../Components/User/NavigationBars/Bottombar.js/Bottombar'


function HomePage() {
  return (

    <div className=' bg-[#F3F2EF] w-full min-h-screen'>
      <Sidebar/>
      <div className='w-full lg:w-11/12 flex justify-center pb-6 max-h-screen overflow-y-auto no-scrollbar'>
      <Home/>
      </div>
      <RightSidebar/>
      <Bottombar/>
    </div>
  )
}

export default HomePage