import axios from 'axios'
import {useNavigate, } from 'react-router-dom'
import {memo, useCallback} from 'react'
import {Button} from 'react-bootstrap'
import url from '../../serverUrl'
function Logout({handleFlash, user, setUser,socket}:{handleFlash:(content: string, state: string) => void,setUser:any,socket:any,user:any})
{
    let navigate = useNavigate()
    const handleLogout = useCallback(()=>
    {
        // axios.get(`${url}logout`,{ withCredentials: true})
        // .then(res=>{
        //     if(res.data==="success")
        //     {
        //     handleFlash("Congratulations! Logged out successfully","success")
        //     navigate('/')
        setUser("")
        localStorage.removeItem('chatappusername');
        navigate('/')
        handleFlash("Congratulations! Logged out successfully","success")
        socket.emit('aUserOffline',(user.username))
        //     }
        //     else
        //     handleFlash(res.data.message,"fail")
        // })
    },[])
    

    return (
        <div className='d-flex justify-content-center w-100'>
            <Button variant='danger' onClick={handleLogout}>Log out</Button>
        </div>
    )
}
export default memo(Logout)