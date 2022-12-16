import React from "react";
import EditProfile from "../../../Components/User/EditProfile/EditProfile";
import Bottombar from "../../../Components/User/NavigationBars/Bottombar.js/Bottombar";
import Sidebar from "../../../Components/User/NavigationBars/UserSidebar/Sidebar";

function EditProfilePage() {
  return( 
        <div>
            <div className=' bg-[#F3F2EF] flex w-full min-h-screen md:pr-4'>                   
                <Sidebar/>          
            <div className=' w-full flex justify-end '>
                <EditProfile/>
            </div>
                <Bottombar/>
            </div>
        </div>
  )
}

export default EditProfilePage;
