import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useFirebase } from '../../context/FirebaseProvider';
import { CircleLoader } from "react-spinners"
import ChatItem from '../ChatItem';



const ChatCol = () => {
    const baseUrl = "https://inotebook-backend-rho.vercel.app/api/firebase/";
    const [msg, setMsg] = useState("");
    const [receiver, setReceiver] = useState(null)
    const param = useParams();
    const firebase = useFirebase();
    const inputRef = useRef(null);
    const chatContainerRef = useRef(null);

    const getName = (email) => {
        let name = email?.substring(0, email.indexOf('@'));
        return name;
    }
    const sendmsg = () => {
        firebase.sendMessage(firebase.user?.uid, param.id, msg)
        setMsg("")
        document.getElementById("chatInp").value = ""
        inputRef.current.focus();
    }
    const handleKeyDown = (e) => {
        if (msg.length !== 0) {
            if (e.key === 'Enter') {
                firebase.sendMessage(firebase.user?.uid, param.id, msg)
                setMsg("")
                document.getElementById("chatInp").value = ""
                inputRef.current.focus();
            }
        }
    };

    const getUser = () => {
        fetch(`${baseUrl}getUser/${param.id}`).then(res => res.json())
            .then(receiver => {
                setReceiver(receiver)
                // console.log(receiver)
            }).catch(err => { console.log(err) })
    }

    useEffect(() => {
        getUser();
        firebase.listenForReadMessages(param.id);
    }, [firebase.ChatArr])
    useEffect(() => {
        firebase.getMessages(firebase.user?.uid, param.id)
    }, [firebase.user, param.id])

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [firebase.ChatArr]);

    return (
        <div className='flex flex-col'>
            <div className=' py-2 bg-gradient-to-tr from-indigo-600 to-teal-400 flex items-center pl-2'>
                <Link to={'/firebasechat'}>
                    <AiOutlineArrowLeft color='white' size={20} />
                </Link>
                <div className='text-white ml-2 flex space-x-2 items-center rounded-md'>
                    <img src={receiver?.dp || "https://www.pngitem.com/pimgs/m/506-5067022_sweet-shap-profile-placeholder-hd-png-download.png"} alt="" className='inline w-5  rounded-sm' />
                    <p>{getName(receiver?.email)}</p>
                </div>
            </div>
            <div className=' bg-slate-200 h-full'>
                <div className=' flex flex-col h-[84vh] pt-2 pl-3 relative w-full '>
                    <div className={`${firebase.loading ? "" : "hidden"}  py-32 flex flex-col items-center space-y-3 mx-auto   `}>
                        <CircleLoader color="blue" />
                        <p className='text-slate-600'>Loading chats</p>
                    </div>
                    <p className={`${firebase.noChats ? "" : "hidden"} bg-green-400 px-5 py-2 mr-2 rounded-md w-auto`}>There are no chats with {receiver?.displayName || receiver?.email}. Start chatting now :)</p>
                    <div className='h-[100%] overflow-y-scroll overflow-x-hidden flex flex-col space-y-3 px-2'
                        ref={chatContainerRef} >
                        {firebase.user && firebase.ChatArr && firebase.ChatArr.map((msg) => {
                            return (
                                <>
                                    <ChatItem msg={msg} key={msg.time} />
                                    
                                    </>
                            )
                        })}
                    </div>
                    <div className={`w-full py-2 pr-2 `} >
                        <input onKeyDown={handleKeyDown} ref={inputRef} type="text" id="chatInp" placeholder='Send message' onChange={(e) => { setMsg(e.target.value) }} className='w-[85%] sm:w-[93%] outline-none bg-white rounded-l-md px-2 py-1' />
                        <button id="sendmsg" disabled={msg == "" ? true : false} className=' text-white  w-[15%] sm:w-[7%] h-full rounded-r-md bg-gradient-to-tr from-indigo-600 to-teal-400  disabled:text-slate-200' onClick={() => sendmsg()}>send</button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ChatCol
