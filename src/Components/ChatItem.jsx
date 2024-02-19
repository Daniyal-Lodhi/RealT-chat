import React, { useState } from 'react'
import { useFirebase } from '../context/FirebaseProvider'
import { BiCheckDouble } from "react-icons/bi";
import { BiCheck } from "react-icons/bi";


const ChatItem = (props) => {





  const show = true
  const firebase = useFirebase();
  const { msg } = props
  function formatTime(datetimeString) {
    const messageTime = new Date(datetimeString);
    return messageTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  return (
    <>
      <div key={msg.time} className={`bg-indigo-200 py-1 px-3 w-auto max-w-96  ${msg?.uid != firebase.user?.uid ? "mr-auto rounded-t-lg rounded-r-lg" : "ml-auto rounded-l-lg rounded-t-lg"} flex flex-col `}>
        <p>{msg.message}</p>
        <div className='ml-auto flex items-center'>
          <p className='text-[10px] text-slate-500 ml-auto'>{formatTime(msg.time)}</p>
          <BiCheckDouble className={`${msg.delivered && msg.read ? '' : "hidden"} text-blue-700 `} />
          <BiCheckDouble className={`${msg.delivered && !msg.read ? '' : "hidden"}`} />
          <BiCheck className={`${!msg.delivered && !msg.read ? '' : "hidden"} ${msg.uid != firebase.user.uid ? 'hidden' : ''}`} />
        </div>

      </div>
      {/* <p className='text-[10px] text-slate-500 ml-auto'>{displayDate(msg.time)}</p> */}
    </>
  )
}

export default ChatItem
