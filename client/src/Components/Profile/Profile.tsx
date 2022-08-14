import axios from 'axios'
import {memo, useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import styles from './Profile.module.css'
import {Button, Card, Modal} from 'react-bootstrap'
import url from '../../serverUrl'
const Profile = ({user,setUser, socket}:{socket:any,user:any,setUser:any}) =>{
    const navigate=useNavigate()
    const [smShow, setSmShow] = useState(false);
    const [deleteFriend, setDeleteFriend] = useState<any>(null)
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
    useEffect(()=>{
        socket.emit("checkFriendOnline",user.username)
    },[])
    return (
        <div className="d-flex flex-column align-items-center">
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
        <h1>Profile ne</h1>
        {user&&
        <>
        <h2>{user.username}'s friends</h2>
        <ul>
            {user.friends.map((item:any,index:number)=>{
                return (
                    <Card className={styles.card} key={index} style={{marginBottom:10}} >
                    <div className='d-flex'>
                    <Card.Body style={{display:'flex', justifyContent:'space-between', alignItems:'center'}} onClick={()=>{navigate(`/chatrooms/${item.username}/${item.roomID}`)}}>
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
                    <Button variant="danger" onClick={() => {setSmShow(true); setDeleteFriend({username:item.username, roomID:item.roomID})}} className="me-2">
                                Delete
                            </Button>
                    </div>
                    </Card>
                )
            })}
            {user.friends.length===0&&<h3>Add friends please</h3>}
        </ul>
        <h3>Click to your friend to go to chat.</h3>
        </>
        }
        </div>
    )
}
export default memo(Profile)
