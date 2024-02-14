import React, { useContext, useEffect, useState } from 'react'
import { createContext } from 'react'
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { getDoc, getFirestore } from "firebase/firestore";
import { getDatabase, push, ref, get, child, onValue } from "firebase/database";
import { useNavigate } from 'react-router-dom';

const firebaseConfig = {
  apiKey: "AIzaSyA9-mmSJYvVtD-85gHuFblH3JQ4wcNtwDA",
  authDomain: "fir-authentication-f4672.firebaseapp.com",
  projectId: "fir-authentication-f4672",
  storageBucket: "fir-authentication-f4672.appspot.com",
  messagingSenderId: "18286112462",
  appId: "1:18286112462:web:9e1611c1d327c9c941ea9f",
  measurementId: "G-3FGTF670P4",
  databaseURL: "https://fir-authentication-f4672-default-rtdb.firebaseio.com/"
};
const app = initializeApp(firebaseConfig);
const realtimeDb = getDatabase();
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const FirebaseContext = createContext();

export const useFirebase = () => useContext(FirebaseContext);

const FirebaseProvider = (props) => {

  const [user, setUser] = useState(null)
  const [ChatArr, setChatArr] = useState([])
  const [noChats,setnoChats] = useState(false) ;
  const [loading,setLoading] = useState(null);
  const navigate = useNavigate()
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
        // console.log(user)
      }
      else {
        setUser(null)
      }

    })

  }, [])
  // functions
  const signinWithGoogle = () => {
    signInWithPopup(auth, provider).then(()=>navigate("/firebasechat")) 
    localStorage.setItem("loggedIn",true) ;

    
  }
  const signout = () => {
    signOut(auth)
    localStorage.setItem("loggedIn",false) ;
    navigate("/")
  }
  const sendMessage = (senderId, receiverId, message) => {
    try {
      let chatId;
      if (senderId > receiverId) {
        chatId = senderId.substring(0, 15) + receiverId.substring(0, 15)
      }
      else {
        chatId = receiverId.substring(0, 15) + senderId.substring(0, 15)
      }
      const chatsRef = ref(realtimeDb, `chats/${chatId}`);
      const newMessageRef = push(chatsRef, {
        uid: senderId,
        message,
        time: Date.now(), // You can use ServerValue.TIMESTAMP to set the timestamp
      });
      console.log("success")
    } catch (error) {
      console.log(error)
    }
  }

  // GET CHATS
  const getMessages = (senderId, receiverId) => {
    try {
      setLoading(true)
      const dbRef = ref(getDatabase());
      let chatId;
      if (senderId && receiverId) {
        if (senderId > receiverId) {
          chatId = senderId?.substring(0, 15) + receiverId.substring(0, 15)
        }
        else {
          chatId = receiverId?.substring(0, 15) + senderId.substring(0, 15)
        }
      }
      const chatRef = child(dbRef, `chats/${chatId}`);

      onValue(chatRef, (snapshot) => {
        
        if(snapshot.exists()){
        const valuesArray = Object.values(snapshot.val());
        setnoChats(false)
        setChatArr(valuesArray)
        }
        else{
          setnoChats(true)

          setChatArr([])
        }
        setLoading(false)
      })
    } catch (error) {
      console.error(error);
    }
  };







  return (
    <div>
      <FirebaseContext.Provider value={{
        signinWithGoogle,
        signout,
        user,
        sendMessage,
        getMessages,
        ChatArr,
        setChatArr,
        loading,
        noChats

      }}>
        {props.children}
      </FirebaseContext.Provider>
    </div>
  )
}


export default FirebaseProvider


export const db = getFirestore(app);
