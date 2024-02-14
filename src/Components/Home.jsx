import React, { useEffect } from 'react'
import { useFirebase } from '../context/FirebaseProvider.jsx'

const Home = () => {

  return (
    <div className='my-32 mx-auto text-center'>
      <div className={`${localStorage.getItem("loggedIn")=='true'?"block":"hidden"}`}>
        <p className='text-3xl font-bold my-2'>Welcome to real-T chat</p>
        <p> which allows you to communicate with your family and friend in real time. click on the side links to explore</p>
         </div>
      <div className={`${localStorage.getItem("loggedIn")!='true'?"block":"hidden"}`}>
        <p>Oh! seems like you are not logged in :(</p>
    <p className='text-3xl font-bold '>
       You need to login to continue further...
    </p>
    </div>
    </div>
  )
}

export default Home
