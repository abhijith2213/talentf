import React,{useEffect, useContext, useState} from "react";
import { MdNotificationsNone,MdWorkOutline } from "react-icons/md";
import { FiMessageSquare} from "react-icons/fi";
import { BiHome, BiMessageSquareAdd} from "react-icons/bi";
import { CgProfile} from "react-icons/cg";

import log from '../../../../assets/images/talentF-c.png'
import { Link ,useNavigate} from "react-router-dom";
import { socket, SocketContext } from "../../../../Context/socketContext";
import { useSelector, useDispatch} from "react-redux";
import {confirmAlert} from 'react-confirm-alert';
import { remove } from "../../../../Redux/User/userSlice";
import { fetchNoCounts } from "../../../../Apis/userRequests";


function Bottombar() {

  const userData = useSelector((state) => state.user)

  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const [open,setOpen] = useState(false)
  const [notifications, setNotifications] = useState('')

  /* ------------------------- NOTIFICATION MANAGEMENT ------------------------ */


  const fetchnotificationCount=async()=>{
    try {
      const {data} = await fetchNoCounts(userData._id)
      setNotifications(data)
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    if(userData){
      socket.emit("new-user-add", userData._id)
      fetchnotificationCount()

    }
  }, []);

  useEffect(()=>{
    socket.on("getNotification",data =>{
      fetchnotificationCount()
   })
  },[socket,notifications])

  /* --------------------------------- LOGOUT --------------------------------- */


  const handleLogout = () => {
    confirmAlert({
      title: 'Logout!',
      message: 'Are you sure to Logout .',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            localStorage.removeItem('userToken')
            localStorage.removeItem('user')
            dispatch(remove())
            navigate('/signin');
    }
  },
  {
    label: 'No',
   
  }
]
    });
 
  }

  /* ---------------------------------- MENUS --------------------------------- */

    const menus = [
      { name: "works", link: "/works", icon: MdWorkOutline },
        { name: "Home", link: "/home", icon: BiHome },
        { name: "Messages", link: "/message", icon: FiMessageSquare ,bottom:true},
      ];

  return (
  <>

<div  className="border shadow-md  bg-white fixed bottom-0 w-full md:hidden">
        
        <div className=" flex  justify-around  relative  ">
          {menus?.map((menu, i) => (
            <Link
              to={menu?.link}
              key={i}
              className={` ${
                menu?.bottom && ""
              } group flex items-center text-sm  gap-3.5 font-medium p-2 hover:bg-gray-300 rounded-md`}>
              <div className="text-2xl sm:text-3xl">{React.createElement(menu?.icon, )}</div>
              <h2 
                style={{
                  transitionDelay: `${i + 3}00ms`,
                }}
                className={`whitespace-pre duration-500 font-normal pr-8 hidden lg:block`}
              >
                {menu?.name}
              </h2>
             
            </Link>
          ))}
        </div>
      </div>
{/* TOP BAR  */}
      <div  className="border shadow-md  bg-white fixed top-0 w-full md:hidden">

      <div className="flex justify-between items-center relative p-3 ">
        <div className="flex items-center justify-between">
          <img className="w-20 h-auto " src={log} alt="" />
        </div>

        <div className="flex gap-5 text-2xl ">
          <div>
            {notifications !== 0 ?  <p className="px-1 text-xs absolute text-white bg-red-500 rounded-full">{notifications}</p> :null}
            <Link to={'/notifications'}>{React.createElement(MdNotificationsNone, )}</Link>

          </div>
        <CgProfile onClick={()=>setOpen(!open)}/>
        </div>
        </div>
      {open ?
        <div className="bg-gray-200 rounded-md absolute right-2 p-4">
          <Link to={'/myprofile'}><p className="cursor-pointer">my profile</p></Link>
          <p className="cursor-pointer" onClick={handleLogout}>Logout</p>
        </div>
      :null}
      </div>
  </>
  )
}

export default Bottombar;
