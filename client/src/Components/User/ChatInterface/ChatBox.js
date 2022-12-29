import React, { useEffect, useRef, useState } from "react"
import { addMessage, getMessages } from "../../../Apis/MessageRequest"
import { getUser } from "../../../Apis/userRequests"
import { format } from "timeago.js"
import InputEmoji from "react-input-emoji"
import {BiArrowBack} from 'react-icons/bi'

import profile from "../../../assets/images/download.png"
import { useErrorHandler } from "react-error-boundary"

function ChatBox({ chat, currentUser, setSendMessage, recieveMessage ,setResponsive}) {
   const PF = process.env.REACT_APP_PUBLIC_FOLDER
   const handleError = useErrorHandler
   const [userData, setUserData] = useState(null)
   const [messages, setMessages] = useState([])
   const [newMessage, setNewMessage] = useState("")
   const scroll = useRef()

   useEffect(() => {
      if (recieveMessage !== null && recieveMessage.chatId === chat._id) {
         setMessages([...messages, recieveMessage])
      }
   }, [recieveMessage])

   //fetch data for header

   useEffect(() => {
      const userId = chat?.members?.find((id) => id !== currentUser)
      const getUserData = async () => {
         try {
            const { data } = await getUser(userId)
            setUserData(data)
         } catch (error) {
            handleError(error)
         }
      }
      if (chat !== null) getUserData()
   }, [chat, currentUser])

   useEffect(() => {
      const fetchMessages = async () => {
         try {
            const { data } = await getMessages(chat._id)
            setMessages(data)
         } catch (error) {
            handleError(error)
         }
      }
      if (chat !== null) fetchMessages()
   }, [chat])

   const handleChange = (newMessage) => {
      if (/^\s/.test(newMessage)) {
         setNewMessage(null)
      } else {
         setNewMessage(newMessage)
      }
   }

   const handleSend = async (e) => {
      e.preventDefault()
      const message = {
         senderId: currentUser,
         text: newMessage,
         chatId: chat._id,
      }

      //send message to database

      try {
         const { data } = await addMessage(message)
         setMessages([...messages, data])
         setNewMessage("")
      } catch (error) {
        handleError(error)

      }

      //Send message to socket server

      const receiverId = chat.members.find((id) => id !== currentUser)
      setSendMessage({ ...message, receiverId })
   }

   // always scroll to bottom

   useEffect(() => {
      scroll.current?.scrollIntoView({ behavior: "smooth" })
   }, [messages])

   return (
      <>
      {chat?
    <div class={`md:col-span-2 relative md:w-full h-[90%]`}>
       <div class='w-full h-full'>
          <div class='relative flex gap-2 items-center p-3 border-b border-gray-300'>
           <span onClick={()=>setResponsive(false)}><BiArrowBack /></span>
             <img
                class='object-cover w-10 h-10 rounded-full'
                src={userData?.profilePic? PF+userData.profilePic : profile}
                alt='username'/>
             <span class='block ml-2 font-bold text-gray-600'>{userData?.userName}</span>
          </div>
          <div class='relative w-full p-6 overflow-y-auto h-[29rem] no-scrollbar'>
             <ul class='space-y-2'>
              {messages?.map((message)=>(
                  <>
                  {message.senderId !== currentUser ?
                <li ref={scroll} class='flex justify-start' key={message._id}>
                   <div class='relative max-w-xl px-4 py-2 bg-cyan-100 rounded shadow rounded-b-xl rounded-tr-xl rounded-tl-none'>
                      <span class='block'>{message.text}</span>
                      <span className="text-xs">{format(message.createdAt)}</span>
                   </div>
                </li>
                :
                <li ref={scroll} class="flex justify-end"  key={message._id}>
                <div class="relative max-w-xl px-4 py-2 text-gray-700 bg-blue-200 rounded-b-xl rounded-tl-xl rounded-tr-none shadow">
                  <span class="block">{message.text}</span>
                  <span className="text-xs">{format(message.createdAt)}</span>
                </div>
              </li>
                }
                </>
              ))}
             </ul>
          </div>
       </div>
       <div class=' flex items-center justify-between w-full p-3 border-t border-gray-300 bottom-0'>

          <InputEmoji
           placeholder='Message'
           class='block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700'
           value={newMessage}
           onChange = {handleChange}
          />
          <button disabled={!newMessage}  onClick={handleSend}>
             <svg
                class='w-5 h-5 text-gray-500 origin-center transform rotate-90'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
                fill='currentColor'>
                <path d='M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z' />
             </svg>
          </button>
       </div>
    </div>
   :
   <div className="hidden md:block w-full h-full lg:flex items-center  justify-center ">
    <span>
      Tap on a chat to start Conversation
    </span>
    </div>
      }
</>
   )
}

export default ChatBox
