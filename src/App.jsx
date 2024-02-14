import { useEffect } from 'react'
import './App.css'
import Chatbot from './Components/Chatbot/Chatbot.jsx'
import ChatCol from './Components/FirebaseChat/ChatCol.jsx'
import FirebaseChat from './Components/FirebaseChat/FirebaseChat.jsx'
import Home from './Components/Home.jsx'
import Navbar from './Components/Navbar.jsx'
import FirebaseProvider, { useFirebase } from './context/FirebaseProvider.jsx'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import Auth from './Components/Auth.jsx'

function App() {

  return (
    <>
      <Router>
        <FirebaseProvider>
          <Navbar />
          <div className="flex sm:space-x-0 sm:flex-row flex-col h-screen ">
            <div className=' sm:w-[28%] w-full bg-slate-900 h-full pt-12 pb-2'>
              <section>
                <div className="flex flex-col mt-5">
                  <div className='text-xl px-5 py-3 text-white rounded-md text-center w-[50%] mx-auto bg-gradient-to-tr from-indigo-600 to-green-600 '>Applications</div>
                  <div className="flex flex-col my-5 justify-center items-center space-y-6">
                    <Link to={"/firebasechat"} className='px-5 py-3 bg-white hover:text-blue-600 rounded-md w-[70%] text-center'>Firebase realtime chat </Link>
                    <Link to={'/chatbot'} className='px-5 py-3 bg-white hover:text-blue-600 rounded-md w-[70%] text-center'>Chat bot</Link>
                  </div>
                </div>
              </section>
            </div>
            <div className='sm:w-[90%] w-full h-full sm:py-12'>
              <Auth>
                <Routes>
                  {/* <Route path="/" element={<Userslist/>} /> */}
                  <Route path="/" element={<Home />} />
                  <Route path="/firebasechat" element={<FirebaseChat />} />
                  <Route path="/chatbot" element={<Chatbot />} />
                  <Route path="/firebasechat/chat/:id" element={<ChatCol />} />

                </Routes>
              </Auth>
            </div>
          </div>
        </FirebaseProvider>
      </Router>

    </>
  )
}

export default App
