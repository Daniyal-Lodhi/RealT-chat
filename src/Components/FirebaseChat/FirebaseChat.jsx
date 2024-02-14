import React, { useEffect, useState } from 'react'
import { AiOutlineArrowRight } from "react-icons/ai";
import { Link } from 'react-router-dom';
import { useFirebase } from '../../context/FirebaseProvider';
import {CircleLoader} from "react-spinners"

const FirebaseChat = () => {
  const firebase = useFirebase();
  const [users, setUsers] = useState(null)
  const getUserList = () => {
    fetch('https://inotebook-backend-rho.vercel.app/api/firebase/getUsers').then(res => res.json()).then(users => { setUsers(users) })
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

  useEffect(() => {
    getUserList();
  }, [])
  useEffect(() => { console.log(users) }, [users])
  return (
    <div className='sm:ml-3 ml-1 mt-2'>  
      <h1 className='text-2xl font-bold'>Registered users </h1>
      <h1 className='text-xl text-slate-700 font-bold mt-2'>Chat with:</h1>
      <div className='flex flex-col space-y-3 py-5   '>
        <div className={`${!users?"block":"hidden"} py-10 mx-auto ml-[45%]  `}>
      <CircleLoader color="blue"  />
      </div>
        {users && users.map((User) => {
          return <Link to={`/firebasechat/chat/${User?.uid}`} id={User?.uid} onMouseEnter={()=>hoverUser(User?.uid)} onMouseLeave={()=>mouseLeave(User?.uid)} className={`${User?.uid == firebase.user?.uid ?"hidden":"" } text-black transition hover:cursor-pointer  flex items-center justify-between space-x-3 w-[90%] mx-auto sm:w-[90%]  border border-purple-500   rounded-md px-3 py-1`} key={User?.uid}>
            <div className='flex items-center space-x-3 w-full'>
              <img src={User.dp?User.dp:"https://www.pngitem.com/pimgs/m/506-5067022_sweet-shap-profile-placeholder-hd-png-download.png"} alt="" className='inline w-5  rounded-sm'  />
              <p className='inline'>{User.email}</p>
              </div>
              <div className='flex items-center space-x-3'>
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
