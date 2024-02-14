import React, { useEffect } from 'react'
import { useFirebase } from '../context/FirebaseProvider'

const Navbar = () => {
    const firebase = useFirebase();
    useEffect(() => {
        console.log(firebase.user)
    }, [])

    return (
        <div>
            <header>
                <nav className="shadow bg-slate-200 fixed w-full ">

                    <div className="flex justify-between items-center py-2 sm:px-10 px-5  container mx-auto">

                        <div>
                            <h1 className="sm:text-2xl font-bold bg-gradient-to-tr from-indigo-600 to-green-600 bg-clip-text text-transparent hover:cursor-pointer text-base ">Real-T chat</h1>
                        </div>

                        <div>


                            <div className="flex items-center">

                                <div className={`${firebase.user ? 'flex' : "hidden"} text-sm sm:text-base  flex items-center space-x-1`}>
                                    <img src={firebase.user?.photoURL} alt="" className='w-5 h-5 rounded-sm' />
                                    <p>{firebase.user?.displayName || firebase.user?.email}</p>

                                </div>
                                <div className="md:flex items-center  space-x-4 ml-8 lg:ml-5">
                                    <div className='flex justify-center items-center border px-2 rounded-md border-blue-500 '>
                                        <button onClick={firebase.signinWithGoogle} className={`${firebase.user ? 'hidden' : "flex"}  justify-center  items-center  sm:space-x-2`}>
                                            <p className="text-text-gray-600 hidden sm:inline-block  hover:cursor-pointer hover:text-indigo-600">Sign in with Google</p>

                                            <img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" alt="" width={40} height={20} />
                                        </button>
                                        <div className='flex items-center space-x-2'>
                                            <button onClick={firebase.signout} className={`${firebase.user ? 'flex' : "hidden"} px-2 py-1 text-center`} >Logout  </button>


                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                </nav>
            </header>
            <main>


            </main>
        </div>
    )
}

export default Navbar
