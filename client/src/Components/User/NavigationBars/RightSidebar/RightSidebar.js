import React, { useEffect, useState } from "react"

import connect from "../../../../assets/images/network.png"
import { useSelector } from "react-redux"
import { Link ,useNavigate} from "react-router-dom"
import userInstance from "../../../../Axios/userAuth"

function RightSidebar() {

  const navigate = useNavigate()
  const PF = process.env.REACT_APP_PUBLIC_FOLDER

  const userData = useSelector(state =>state.user)


  const [suggestions,setSuggestions] = useState([])
  const [state, setState] = useState(false)
  const userId = userData._id

useEffect(() => {
    userInstance.get(`/suggestions/${userId}`).then((res)=>{
    setSuggestions(res.data)

}).catch((error)=>{
  if(!error?.auth){
    navigate('/signin')
 }
  console.log(error,'error com');
})
}, [state]);


// HANDLE FOLLOW 

const handleFollow= (Id)=>{
  userInstance.put(`/${userId}/follow`,{Id}).then((res)=>{
    setState(!state)
  }).catch((err)=>{
    console.log(err);
  })

}

// HANDLE UN FOLLOW 

const handleUnFollow = (Id)=>{
  userInstance.put(`/${userId}/unfollow`,{Id}).then((res)=>{
    setState(!state)
  }).catch((err)=>{
    console.log(err);
  })
}


   return (
      <div className='bg-white  lg:mx-0 lg:m-12  lg:fixed right-0 top-0  shadow-md rounded-md p-8'>
         <p className='mb-6 text-black lg:text-blue-500 font-medium'>Suggestions For You</p>


         {suggestions.length !==0? suggestions?.map((user,index)=>{
          if(user._id != userId ){
              return   (           
                <div className='flex justify-between items-center mb-5 gap-11' key={index}>
                  <Link to={`/profile/${user.userName}`}>
                   <div className='flex'>
                      <img className='rounded-full w-12 h-12 ' src={ PF+user.profilePic } alt='pic' />
                      <div className='flex flex-col justify-center items-center ml-3'>
                         <p className='font-medium text-sm'>{user.userName}</p>
                         <p className='font-normal text-xs'>{user.accountType}</p>
                      </div>
                   </div></Link>
                  { !user.followers.includes(userId)?
                   <button type="button" className="text-white flex justify-center bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:outline-none  font-medium rounded-lg text-sm px-4 py-2 text-center mr-2 mb-2 w-20"  onClick={(e)=>handleFollow(user._id)}>follow</button>
                   :  <button type="button" className="text-white flex justify-center bg-gradient-to-r from-violet-500 via-violet-600 to-violet-700 hover:bg-gradient-to-br focus:outline-none  font-medium rounded-lg text-sm px-4 py-2 text-center mr-2 mb-2 w-20"  onClick={(e)=>handleUnFollow(user._id)}>unfollow</button>
                  }
                  </div>
                )      
          }
      }) :<div className="flex flex-col items-center gap-2">
             <p>Connect with more People.</p> 
             <img className="w-20 opacity-60" src={connect}></img>
             <p className="text-xs">No suggestions available ....</p>   
          </div>}
      </div>
   )
}

export default RightSidebar
