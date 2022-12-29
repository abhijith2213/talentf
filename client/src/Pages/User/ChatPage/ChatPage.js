import React from "react";
import Sidebar from "../../../Components/User/NavigationBars/UserSidebar/Sidebar";
import ChatInterface from "../../../Components/User/ChatInterface/ChatInterface";
import Bottombar from '../../../Components/User/NavigationBars/Bottombar.js/Bottombar'


function ChatPage() {
  return (

    <div className=' bg-[#F3F2EF] flex w-full min-h-screen overflow-y-hidden md:pr-4 overflow-hidden'> 

        <Sidebar/> 

        <div className=' w-full h-screen  flex justify-center md:justify-end '>
            <ChatInterface/>
        </div>

        <Bottombar/>

    </div>      
  )
}

export default ChatPage;
