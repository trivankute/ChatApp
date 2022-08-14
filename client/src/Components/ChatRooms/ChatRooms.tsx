import {memo, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {Button, Card} from 'react-bootstrap'
import styles from './ChatRooms.module.css'
const ChatRoom = ({user, socket}:{user:any, socket:any}) => {
    const navigate= useNavigate()
    
    useEffect(()=>{
        socket.emit("checkFriendOnline",user.username)
    },[])
    useEffect(()=>{
        navigate('/chatrooms')
    },[user.friends])
    return (
        <div>
                <h1 className="text-center">
                    Your friends:
                    <br></br>
                    <ul>
                    {user.friends.map((item:any,index:number)=>{
                        return (
                            <Card className={styles.card} key={index} style={{marginBottom:10}} >
                            <div className='d-flex'>
                            <Card.Body style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}
                             onClick={()=>{navigate(`/chatrooms/${item.username}/${item.roomID}`)}}>
                                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                        <h3>
                                        {item.username}
                                        </h3>
                                    {
                                    <div className={item.online?"onlineOrOffline bg-success":"onlineOrOffline bg-secondary"}>
                                    </div>
                                    }
                                </div>
                            </Card.Body>
                            </div>
                            </Card>
                        )
                    })}
                    </ul>
                </h1>
            {
                user.friends.length<=0&&
                <>
                Add friends first to start chatting
                <br></br>
                <Button onClick = {()=>{navigate('/')}}>Go back to Home</Button>
                </>
            }
        </div>
    )
}
export default memo(ChatRoom)