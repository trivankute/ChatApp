import React, { useLayoutEffect } from 'react';
import {useState, useEffect, useContext} from 'react'
import {Routes, Route} from 'react-router-dom'
// Components
import Home from './Components/Home/Home'
import Register from './Components/Register/Register'
import Login from './Components/Login/Login'
import Logout from './Components/Logout/Logout'
import Error from './Components/Error/Error'
import ChatRooms from './Components/ChatRooms/ChatRooms'
import ChatPage from './Components/ChatPage/ChatPage'
import Profile from './Components/Profile/Profile'
import ShareLayout from './Components/ShareLayout/ShareLayout'
import Loading from './Components/Loading/Loading'
// axios
import axios from 'axios'
// flash and globalState
import {flashContext} from './States/ForFlash'

// socket
import io from 'socket.io-client';
import url from './serverUrl'
const socket = io(url)

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [user,setUser] = useState<any>(null)
  const [forCheckOnline, setForCheckOnline] = useState(false)
  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);
  async function handleName(signalToCheckOnline=false)
  {
    // await axios.get(url, { withCredentials: true})
    // .then((res) => {
    //   if(res.data.state==="success")
    //     {
    //       setUser(res.data.user)
    //       if(signalToCheckOnline)
    //       setForCheckOnline(prev=>!prev)
    //     }
    //   })
    if(localStorage.getItem('chatappusername'))
    await axios.post(url, {id:localStorage.getItem('chatappusername')}, { withCredentials: true})
      .then((res) => {
        if(res.data.state==="success")
          {
            setUser(res.data.user)
            if(signalToCheckOnline)
            setForCheckOnline(prev=>!prev)
          }
        })
    else
    setUser('')
  }
  // take API
  useEffect(()=>{
      handleName()
      socket.on('afterAUserOnlineOrOff',()=>{
        setForCheckOnline(prev=>!prev)
      })
  },[])
  useLayoutEffect(()=>{
    socket.on('forSetUser',(signalToCheckOnline, forFlash="", state="success")=>{
      handleName(signalToCheckOnline)
      if(forFlash!="")
      {
        handleFlash(forFlash, state)
      }
    })
    socket.on("afterCheckFriendOnline", (newUser:any) => {
        setUser(()=>{
            return newUser
        })
    })
  },[])
  useEffect(()=>{
    if(user)
    socket.emit("checkFriendOnline",user.username)
  },[forCheckOnline])

  const {setFlashPop, setFlashContent, setFlashState} = useContext(flashContext)  
  function handleFlash(content:string,state:string)
  {
    setFlashContent(content)
    setFlashState(state)
    setFlashPop(true)
  }

  return (
      <>
      <Routes>
          <Route path='/' element={
          localStorage.getItem('chatappusername') ?
          user ?
          <ShareLayout user={user} setUser={setUser} socket={socket}></ShareLayout>
          :
          <Loading user={user}/>
          :
          <ShareLayout user={user} setUser={setUser} socket={socket}></ShareLayout>
          }>
            <Route index element={
            <Home user={user} setUser={setUser} socket={socket} setForCheckOnline={setForCheckOnline}/>
            }/>
            <Route path='/register' element={
            <Register handleFlash={handleFlash} setUser={setUser} socket={socket}/>
            }/>

            <Route path='/login' element={
            <Login handleFlash={handleFlash} setUser={setUser} socket={socket}/>
            }/>

            <Route path='/logout' element={
            <>
              {
                user ?
                <Logout handleFlash={handleFlash}  user={user} setUser={setUser} socket={socket}/>
                :
                localStorage.getItem('chatappusername') ?
                <Loading user={user}/>
                :
                <Error/>
              }
            </>
            }/>

            <Route path='/profile/:profileID' element={
            <>
              {
                user ?
                <Profile user={user} setUser={setUser} socket={socket}/>
                :
                localStorage.getItem('chatappusername') ?
                <Loading user={user}/>
                :
                <Error/>
              }
            </>
            }/>

            <Route path='/chatrooms' element={
            <>
              {
                user ?
                <ChatRooms user={user} socket={socket}/>
                :
                localStorage.getItem('chatappusername') ?
                <Loading user={user}/>
                :
                <Error/>
              }
            </>
            }/>

            <Route path='/chatrooms/:friendName/:chatPageID' element={
            <>
              {
                user ?
                <ChatPage user={user} socket={socket} setUser={setUser}/>
                :
                localStorage.getItem('chatappusername') ?
                <Loading user={user}/>
                :
                <Error/>
              }
            </>
            }/>
          </Route>
          <Route path='/*' element={<Error/>}/>
      </Routes>
      </>
  );
}

export default App;
