import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {confirmAlert} from 'react-confirm-alert'

import { HiMenuAlt3, HiOutlineLogout } from "react-icons/hi";
import { MdOutlineDashboard,MdOutlineWorkOutline,MdPhotoCameraBack } from "react-icons/md";
import { AiOutlineUser} from "react-icons/ai";

import { Link, Outlet } from "react-router-dom";

function AdminSideBar() {

  const navigate = useNavigate()

  const handleLogout = (e) => {
    e.preventDefault()
    console.log('in logout');
    confirmAlert({
      title: 'Logout!',
      message: 'Are you sure to Logout .',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            localStorage.removeItem('adminToken')
            navigate('/admin_login');
    }
  },
  {
    label: 'No',
   
  }
]
    });
 
  }


    const menus = [
        { name: "dashboard", link: "/admin/admin_panel", icon: MdOutlineDashboard },
        { name: "User Management", link: "/admin/user_management", icon: AiOutlineUser },
        { name: "Post Management", link: "/admin/post_management", icon: MdPhotoCameraBack },
        { name: "Job Management", link: "/admin/job_management", icon: MdOutlineWorkOutline },

        { name: "Logout", link: "/admin_login", icon: HiOutlineLogout, margin: true },
      ];
      const [open, setOpen] = useState(true);


  return (
    
    <div>
         <div
        className={`bg-[#0e0e0e] min-h-screen ${
          open ? "w-72" : "w-16"
        } duration-500 text-gray-100 px-4`}
      >
        <div className="py-3 flex justify-end">
          <HiMenuAlt3
            size={26}
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <div className="mt-4 flex flex-col gap-4 relative">
          {menus?.map((menu, i) => (
            <Link
              to={menu?.link}
              key={i}
              className={` ${
                menu?.margin && "mt-10"
              } group flex items-center text-sm  gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md`}>
              {menu?.name=="Logout" ? <div onClick={handleLogout}>{React.createElement(menu?.icon, { size: "20" })}</div>: <div>{React.createElement(menu?.icon, { size: "20" })}</div> }
              <h2
                style={{
                  transitionDelay: `${i + 3}00ms`,
                }}
                className={`whitespace-pre duration-500 ${
                  !open && "opacity-0 translate-x-28 overflow-hidden"
                }`}
              >
                {menu?.name}
              </h2>
              <h2
                className={`${
                  open && "hidden"
                } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
              >
                {menu?.name}
              </h2>
            </Link>
          ))}
        </div>
      </div>
      
    
    </div>
     
      
  )
}

export default AdminSideBar