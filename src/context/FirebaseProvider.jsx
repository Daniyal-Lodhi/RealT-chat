import React, { useContext, useEffect, useState } from 'react'
import { createContext } from 'react'
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { getDoc, getFirestore } from "firebase/firestore";
import { getDatabase, push, ref, get, child, onValue, query, orderByChild, equalTo, update, off } from "firebase/database";
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
const dbRef = getDatabase();
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const FirebaseContext = createContext();

export const useFirebase = () => useContext(FirebaseContext);

const FirebaseProvider = (props) => {

  const [user, setUser] = useState(null)
  const [ChatArr, setChatArr] = useState([])
  const [noChats, setnoChats] = useState(false);
  const [loading, setLoading] = useState(null);
  const [Rid, SetRid] = useState(null)
  const [unreadChats, setUnreadChats] = useState([]);
  const [deliveredChats,setDeliveredChats] = useState([])
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
  const calculateChatId = (uid, Rid) => {
    let chatId;
    if (uid > Rid) {
      chatId = uid?.substring(0, 15) + Rid?.substring(0, 15)
    }
    else {
      chatId = Rid?.substring(0, 15) + uid?.substring(0, 15)
    }
    return chatId;
  }
  const signinWithGoogle = () => {
    signInWithPopup(auth, provider).then(() => navigate("/firebasechat"))
    localStorage.setItem("loggedIn", true);


  }
  const signout = () => {
    signOut(auth)
    localStorage.setItem("loggedIn", false);
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
      const chatsRef = ref(dbRef, `chats/${chatId}`);
      const newMessageRef = push(chatsRef, {
        uid: senderId,
        message,
        delivered: false,
        read: false,
        time: Date.now(), // You can use ServerValue.TIMESTAMP to set the timestamp
      });
      // console.log("success")
    } catch (error) {
      console.log(error)
    }
  }

  // GET CHATS
  const getMessages = (senderId, receiverId) => {
    try {
      SetRid(receiverId) // to store receiver's id
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

        if (snapshot.exists()) {
          const valuesArray = Object.entries(snapshot.val()).map(([id, data]) => ({ id, ...data }));
          setnoChats(false)
          setChatArr(valuesArray)
          // console.log(ChatArr)
        }
        else {
          setnoChats(true)

          setChatArr([])
        }
        setLoading(false)
      })
    } catch (error) {
      console.error(error);
    }
  };
  // get unread msgs for registered user 
  const getUnreadMsgs = () => {
    // getting all the chats
    const unReadchatsRef = ref(dbRef, `chats`);
    onValue(unReadchatsRef, (snapshot) => {
      if (snapshot.exists()) {
        // making the array out of the returned obj
        let valuesArray = Object.entries(snapshot.val()).map(([id, data]) => ({ id, ...data }));
        // making the array of just values of object (no keys)
        valuesArray = valuesArray.map((obj) => Object.values(obj))
        // console.log(valuesArray)
        let tempUnreadChatArr = [];
        valuesArray.forEach((item) => {
          let unreadChatCounter = 0;
          item.forEach((obj)=>{
            if(typeof obj == 'object' && obj.read == false && obj.uid!==user?.uid) unreadChatCounter++;
          })
          tempUnreadChatArr.push({
            [item[0]]: unreadChatCounter
          });
        });
        setUnreadChats(tempUnreadChatArr) ;
        // console.log(unreadChats)
      }
    })
  }
  // to update if message delivered 
  const listenForReadMessages = (recId) => {
    // Replace 'your-chat-id' with the specific chat ID you're interested in
    const chatId = calculateChatId(user?.uid, Rid);
    const readMessagesRef = ref(dbRef, `chats/${chatId}`);
    // console.log(Rid)
    const readMessagesQuery = query(
      readMessagesRef,
      orderByChild('uid'), equalTo(recId)
    );
    onValue(readMessagesQuery, (snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const messageId = childSnapshot.key;
          // Update the delivered status to true
          update(ref(dbRef, `chats/${chatId}/${messageId}`), {
            read: true,
            delivered:true
          }).then(() => {
            // console.log('Update successful for:', messageId);
          }).catch((error) => {
            console.error('Error updating message:', error);
          });
          // console.log(messageId)
        });
      }
    });
    // console.log(location.pathname)
    if (location.pathname != `/firebasechat/chat/${chatId}`) {
      off(readMessagesQuery);
    }
  };

  // Call the function with the user's UID

  const updateDeliverStatus = (uid)=>{
    let chatRef = ref(dbRef,'chats') ;
      let x = onValue(chatRef,(snapshot)=>{
        setDeliveredChats(snapshot.val()) ;
        // console.log(snapshot.val()) ;
        let undeliveredValuesArray = Object.entries(snapshot.val()).map((entry)=>entry)
        for (let i = 0 ; i<undeliveredValuesArray.length ; i++){
         Object.entries(undeliveredValuesArray[i][1]).forEach((obj)=>{
          // console.log(obj)
          if(user){
          if(obj[1].delivered==false && location.pathname=='/firebasechat'){ 
            // console.log(user)  
            // console.log("hello")
            update(ref(dbRef, `chats/${undeliveredValuesArray[i][0]}/${obj[0]}`), {
            delivered: true,
          }).then(() => {
            // console.log('Update successful for:', messageId);
            // console.log("success")
          }).catch((error) => {
            console.error('Error updating message:', error);
          });
          }
         }})

        }
        // console.log(undeliveredValuesArray)
      })

  }






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
        noChats,
        listenForReadMessages,
        getUnreadMsgs,
        unreadChats,
        calculateChatId,
        updateDeliverStatus,


      }}>
        {props.children}
      </FirebaseContext.Provider>
    </div>
  )
}


export default FirebaseProvider


export const db = getFirestore(app);
