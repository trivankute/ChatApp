import axios from 'axios'
import {memo, useState, useEffect} from 'react'
import {Button, Form, Card} from 'react-bootstrap'
import Event_bus from '../Event_bus'
import url from '../../serverUrl'

function LeftColumn({user,setUser,socket}:{socket:any,user:any,setUser:any})
{
    const [findFriend,setFindFriend] = useState<string>("")
    const [friendFindArray,setFriendFindArray] = useState<Array<any>|string>([])
    const [findSuccess,setFindSuccess] = useState<boolean>(false)
    useEffect(()=>{
        if(!user)
        {
            setFindFriend("")
            setFriendFindArray([])
            setFindSuccess(false)
        }
    },[user])
    useEffect(()=>{
        function handleEventBusOne({friendName}:{friendName:string})
        {
            let newFindArray = []
            if(typeof friendFindArray !== 'string')
            newFindArray = friendFindArray.filter((item:any)=>item.username!==friendName)
            setFriendFindArray(newFindArray)
        }
        Event_bus.on('forFindFriendArrayAfterAcceptFriend',(data:any)=>{
            handleEventBusOne(data)
        })
        socket.on('addFriendSuccess',(friendName:String)=>{
            Event_bus.dispatch('forFindFriendArrayAfterAcceptFriend', {friendName:friendName})
        })
        return () => {
        Event_bus.remove('forFindFriendArrayAfterAcceptFriend',(data:any)=>{
            handleEventBusOne(data)
        })
        }

    },[])
    function handleAddFriend(username2:string)
    {
        axios.post(`${url}profile/${user._id}/addfriend`,{friendName:username2},{withCredentials: true})
        .then((res)=>{
            if(res.data.state==='success')
            {
                    setUser(res.data.user)
                    socket.emit('forSetUser',username2)
                    // let newFindArray = []
                    // if(typeof friendFindArray !== 'string')
                    // newFindArray = friendFindArray.filter((item:any)=>item.username!==username2)
                    // setFriendFindArray(newFindArray)
                }
            })
    }
    function handleFindFriend()
    {
        setFindFriend("")
        axios.get(`${url}profile/${user._id}?friendname=${findFriend}`,{withCredentials: true})
            .then(res=>{
                if(res.data.state==='success')
                    {
                    if(res.data.friends.length===0)
                    {
                        setFriendFindArray("There is nobody whose name starts with that name")
                        setFindSuccess(false)
                    }
                    else
                    {setFriendFindArray(res.data.friends)
                    setFindSuccess(true)}
                    }
                else
                    {setFriendFindArray(res.data.message)
                    setFindSuccess(false)}
            })
    }
    return (
        <div style={{display:'block'}} 
        className="p-3 vh-100 bg-secondary d-flex flex-column align-items-center" >
            {!user &&
            <div style={{marginTop:10}}>
                <h3>Nice to meet you, login to unclock this</h3>
                <h3>For: find your friends and start chatting</h3>
            </div>
            }
            {user && <div style={{marginTop:10}}>
            <Card style={{ width: '100%', marginBottom:10 }}>
            <Card.Body >
                <Card.Title className="text-center">
                    <h3>Find friends</h3>
                </Card.Title>
                <Form onSubmit={(e)=>{e.preventDefault();handleFindFriend()}}>
                    <Form.Group>
                        <Form.Control className="round" type="text" placeholder="Your friend's name" value={findFriend} onChange={(e)=>{setFindFriend(e.target.value)}} />
                    </Form.Group>
                        <Button style={{marginTop:"5px"}} onClick={handleFindFriend}>Find</Button>
                </Form>
            </Card.Body>
            </Card>
            {findSuccess===true?
            <>
            {typeof friendFindArray !== 'string'&&
                <div style={{height:'100%'}}>
                    {
                        friendFindArray.map((item,index)=>{
                            return <Card key={index} style={{overflow:'hidden', marginBottom:'10px'}}>
                                <div className="d-flex justify-content-between">
                                <Card.Body>
                                <Card.Title>
                                    {item.username}
                                    </Card.Title>
                                </Card.Body>
                                {
                                    user.addFriendsSent.includes(item.username) ?
                                    <Button variant="secondary" style={{cursor:'default'}}>Sent</Button>
                                    :
                                    user.addFriendsReceive.includes(item.username) ?
                                    <Button variant="secondary" style={{cursor:'default'}}>Received</Button>
                                    :
                                    <Button variant="success" onClick={()=>handleAddFriend(item.username)}>Add Friend</Button>
                                    
                                }
                                </div>
                            </Card>
                        })
                    }
                </div>
            }
            </>
            :
            <h3>
            {friendFindArray}
            </h3>
            }
            </div>
            }
        </div>
    )
}
export default memo(LeftColumn)