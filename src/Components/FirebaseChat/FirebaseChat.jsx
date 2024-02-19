import React, { useEffect, useState } from 'react'
import { AiOutlineArrowRight } from "react-icons/ai";
import { Link } from 'react-router-dom';
import { useFirebase } from '../../context/FirebaseProvider';
import {CircleLoader} from "react-spinners"

const FirebaseChat = () => {
  const baseUrl = "http://localhost:3000";
  const firebase = useFirebase();
  const [users, setUsers] = useState(null)
  const [unreadMsgs, setUnreadMsgs] = useState(0);

  const getUserList = () => {
    fetch(`${baseUrl}/getUsers`).then(res => res.json()).then(users => { setUsers(users) })
  }
  const hoverUser = (id)=>{
    let userDiv = document.getElementById(id) ;
    if(userDiv){
     userDiv.style.backgroundColor = ""
     userDiv.style.scale = '1.06'
     userDiv.style.padding = "12px"
     userDiv.classList.add("gradient-bg")

    }
  }
  const mouseLeave = (id)=>{
    let userDiv = document.getElementById(id) ;
    if(userDiv)
    if(userDiv){
      userDiv.style.backgroundColor = ""
      userDiv.style.scale = '1'
      userDiv.style.padding = ""
      userDiv.classList.remove("gradient-bg")

     }  }

     const getName = (email)=>{
        let name = email.substring(0,email.indexOf('@')) ;
        return name ; 
     }

     const getUnreadMsg = (id)=>{
      let chatId = firebase.calculateChatId(firebase.user?.uid,id)
      // console.log(chatId)
      const targetObject = firebase.unreadChats?.find(obj => Object.keys(obj)[0] === chatId);
      // console.log(targetObject)
      if(targetObject){
      if(targetObject[chatId]>9){
          return "9+"
        }
        else if(targetObject[chatId]<=0){
          return ""
        }
      else{
          return targetObject[chatId]
        }
     }  
     }
    
     useEffect(()=>{
      firebase.updateDeliverStatus("firebase.user?.uid")
     },[firebase.user,firebase.unreadChats])
  useEffect(() => { 
    getUserList();
    // listenForReadMessages()
    firebase.getUnreadMsgs()

  }, [unreadMsgs])
  // useEffect(() => { console.log(users) }, [users])
  return (
    <div className='sm:ml-3 ml-1 mt-2'>  
      <h1 className='text-2xl font-bold'>Registered users </h1>
      <button onClick={()=>console.log(firebase.unreadChats)} >print</button>
      <h1 className='text-xl text-slate-700 font-bold mt-2'>Chat with:</h1>
      <div className='flex flex-col space-y-3 py-5   '>
        <div className={`${!users?"block":"hidden"} py-10 mx-auto ml-[45%]  `}>
      <CircleLoader color="blue"  />
      </div>
        {users && users.map((User) => {
          return <Link to={`/firebasechat/chat/${User?.uid}`} id={User?.uid} onMouseEnter={()=>hoverUser(User?.uid)} onMouseLeave={()=>mouseLeave(User?.uid)} className={`${User?.uid == firebase.user?.uid ?"hidden":"" } text-black transition hover:cursor-pointer  flex items-center justify-between space-x-3 w-[90%] mx-auto sm:w-[90%]  border border-purple-500   rounded-md px-3 py-1`} key={User?.uid}>
            <div className='flex items-center space-x-3 w-full'>
              <img src={User.dp?User.dp:"https://www.pngitem.com/pimgs/m/506-5067022_sweet-shap-profile-placeholder-hd-png-download.png"} alt="" className='inline w-5  rounded-sm'  />
              <p className='inline'>{getName(User.email)}</p>
              <p></p>
              </div>
              <div className='flex items-center space-x-3'>
              <p className='bg-indigo-400 text-xs rounded-full text-white px-2 mr-2'>{getUnreadMsg(User?.uid)}</p>
              {/* <p className=' bg-red-500 text-xs rounded-full text-white px-2 '>2</p> */}
                <p>Chat</p>
              <AiOutlineArrowRight/>
              </div>
          </Link>
        })}
      </div>

    </div>
  )
}

export default FirebaseChat
