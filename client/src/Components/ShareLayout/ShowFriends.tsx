import axios from 'axios'
import {memo, useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {Button, Card, Modal} from 'react-bootstrap'
import styles from './ShowFriends.module.css'
import url from '../../serverUrl'
function ShowFriends({user,setUser, socket}:{socket:any, user:any,setUser:any})
{
    const [deleteFriend, setDeleteFriend] = useState<any>(null)
    const [smShow, setSmShow] = useState(false);
    const navigate = useNavigate()
    function handleDeleteFriend(username:string,roomID:string)
    {
        axios.post(`${url}profile/${user._id}/deletefriend`,{username:username,roomID:roomID},{withCredentials: true})
            .then((res)=>{
                if(res.data.state==='success')
                {
                    setUser(res.data.user)
                    socket.emit('forSetUser',username)
                }
            })
    }
    // useEffect(()=>{
    //     setUser(user)
    // },[user.friends])
    return (
        <div className='w-100' style={{display:'flex'}}>
            <Modal
                size="sm"
                show={smShow}
                onHide={() => setSmShow(false)}
                aria-labelledby="example-modal-sizes-title-sm"
            >
                <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-sm">
                    Ting tong!
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure to delete your friend?
                    <div className="d-flex justify-content-center mt-3">
                    <Button variant="danger md" onClick={() => {setSmShow(false);handleDeleteFriend(deleteFriend.username, deleteFriend.roomID)}} className="me-2">
                        Yes
                    </Button>
                    <Button variant="primary" onClick={() => setSmShow(false)} className="me-2">
                        No
                    </Button>
                    </div>
                </Modal.Body>
            </Modal>
            <ul className='w-100 position-relative'>
                {user.friends.map((item:any,index:number)=>{
                    return (
                        <Card className={styles.card} key={index} style={{marginBottom:10}} >
                            <div className='w-100 h-100 d-flex'>
                            <Card.Body style={{minWidth:50}} onClick={()=>{navigate(`/chatrooms/${item.username}/${item.roomID}`)}}>
                                <div style={{display:'flex', flexDirection:'column', justifyContent:'space-between', alignItems:'center'}}>
                                        <h3>
                                        {item.username}
                                        </h3>
                                    {
                                    <div className={item.online?"onlineOrOffline bg-success":"onlineOrOffline bg-secondary"}>
                                    </div>
                                    }
                                    {   
                                        item.newMess>0&&
                                        <div className="forChatSignal bg-danger d-flex justify-content-center position-absolute"
                                            style={{color:"white", top:'-5px', left:'-5px', margin:0}}>
                                            {item.newMess}
                                        </div>
                                    }
                                </div>
                            </Card.Body >
                                <Button  size='sm'  variant="danger" onClick={() => {setSmShow(true); setDeleteFriend({username:item.username, roomID:item.roomID})}}>
                                    Delete
                                </Button>
                            </div>
                        </Card>
                    )
                })}
            </ul>
        </div>
    )
}
export default memo(ShowFriends)