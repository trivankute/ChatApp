import {useNavigate} from 'react-router-dom'
import {useState} from 'react'
import {Button, Card, Modal} from 'react-bootstrap'
import axios from 'axios'
import Event_bus from '../Event_bus'
import url from '../../serverUrl'
export default function Home({user, setUser, socket, setForCheckOnline}:{setForCheckOnline:any, socket:any, setUser:any,user:any}){
    const navigate= useNavigate()
    const [showSentInvitations, setShowSentInvitations] = useState(false);
    const [showReceiveInvitations, setShowReceiveInvitations] = useState(false);
    async function handleRejectInvitation(friendName:string)
    {
        axios.post(`${url}profile/${user._id}/rejectaddfriend`,{friendName:friendName},{withCredentials: true})
            .then(res=>{
                if(res.data.state==='success')
                {
                    setUser(res.data.user)
                    socket.emit('forSetUser',friendName, `${friendName} has just canceled your invitation`, 'fail')
                }
            })
    }
    async function handleAcceptInvitation(username1:string, username2:string)
    {
      axios.post(`${url}profile/${user._id}/acceptfriend`,{username1:username1, username2:username2},{withCredentials: true})
          .then(res=>{
              if(res.data.state==='success')
              {
                  setUser(res.data.user)
                  Event_bus.dispatch('forFindFriendArrayAfterAcceptFriend', {friendName:username2})
                  socket.emit('addFriendSuccess',username2)
                  socket.emit('forSetUser',username2,`${username2} has just accepted your invitation`, 'success', true)
                  setForCheckOnline((prev:boolean)=>!prev)
              }
          })
    }
    return (
        <div className="d-flex flex-column align-items-center justify-content-center">
        <h1>HOME</h1>
        {!user && <h2 style={{color:"#333"}}>Welcome, Register or Login to start</h2>}
        {!user && <>
            <Button onClick={()=>{navigate('/login')}} style={{marginBottom:"10px"}}>Login</Button>
            <Button onClick={()=>{navigate('/register')}} className="bg-success">Register</Button>
        </>}
        {user && <h2>Hi {user.username}</h2>}
        {user &&
        <Button onClick={()=>{navigate('/chatrooms')}} style={{marginBottom:10}}> Go to chat rooms </Button>
        }
        {user && 
        <div>
            <Modal
            size="lg"
            show={showSentInvitations}
            onHide={() => setShowSentInvitations(false)}
            aria-labelledby="example-modal-sizes-title-lg"
            >
            <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
                Your sent invitations: {user.addFriendsSent.length}
            </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{maxHeight:'550px', overflowY:'scroll'}}>
                {user.addFriendsSent.map((item:string, index:number)=>
                    <>
                    <Card key={index} style={{marginBottom:10}} >
                    <div className='d-flex align-items-center'>
                    <Card.Body style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                            <h3>
                            {item}
                            </h3>
                        </div>
                    </Card.Body>
                    </div>
                    </Card>
                    
                    </>
                )}
            </Modal.Body>
            </Modal>

            <Modal
            size="lg"
            show={showReceiveInvitations}
            onHide={() => setShowReceiveInvitations(false)}
            aria-labelledby="example-modal-sizes-title-lg"
            >
            <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
                You have received invitations: {user.addFriendsReceive.length}
            </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{maxHeight:'550px', overflowY:'scroll'}}>
                {user.addFriendsReceive.map((item:string, index:number)=>
                    <>
                    <Card key={index} style={{marginBottom:10}} >
                    <div className='d-flex align-items-center'>
                    <Card.Body style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                            <h3>
                            {item}
                            </h3>
                        </div>
                    </Card.Body>
                    <Button variant="primary" style={{marginRight:10}} onClick={()=>{handleAcceptInvitation(user.username, item)}}>Accept</Button>
                    <Button variant="danger" style={{marginRight:10}} onClick={()=>{handleRejectInvitation(item)}}>Reject</Button>
                    </div>
                    </Card>
                    
                    </>
                )}
            </Modal.Body>
            </Modal>
             {[
        'Secondary'
      ].map((variant) => (
        <Card
          bg={variant.toLowerCase()}
          key={variant}
          text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}
          style={{ width: '18rem' }}
          className="mb-2"
        >
          <Card.Header>You have sent {user.addFriendsSent.length} add-friend invitations</Card.Header>
          <Card.Body className="d-flex flex-column align-items-center">
            <Card.Title>Views your invitations</Card.Title>
            <Button variant='light' onClick={() => setShowSentInvitations(true)}>Click here!</Button>
          </Card.Body>
        </Card>
      ))}
        {[
        'Light'
      ].map((variant) => (
        <Card
          bg={variant.toLowerCase()}
          key={variant}
          text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}
          style={{ width: '18rem' }}
          className="mb-2"
        >
          <Card.Header>You have received {user.addFriendsReceive.length} add-friend invitations</Card.Header>
          <Card.Body className="d-flex flex-column align-items-center">
            <Card.Title>All received invitations</Card.Title>
            <Button variant={user.addFriendsReceive.length===0?'secondary':'success'} onClick={() => setShowReceiveInvitations(true)}>Click here to accept</Button>
          </Card.Body>
        </Card>
      ))}
        </div>
        }
        </div>
    )
}