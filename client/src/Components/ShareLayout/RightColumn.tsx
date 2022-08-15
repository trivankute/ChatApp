import {memo} from 'react'
import ShowFriends from './ShowFriends'
function RightColumn({user,setUser, socket, toggleOffCanvas=""}:{socket:any, user:any,setUser:any, toggleOffCanvas:any})
{
    return (
        <div style={{backgroundColor:"violet", display:'block'}} 
        className=" p-3 vh-100 bg-secondary d-flex flex-column align-items-center" >
            {!user&&
            <div style={{marginTop:10}}>
                <h3>Nice to meet you, login to unclock this</h3>
                <h3>For: Showing friends and start chatting</h3>
            </div>
            }
            
            {user&&
            <>
            <h2>{user.username} friends:</h2>
            <ShowFriends user={user} setUser={setUser} socket={socket} toggleOffCanvas={toggleOffCanvas}/>
            <h3>Click onto your friend to go to chat.</h3>
            </>
            }
        </div>
    )
}
export default memo(RightColumn)