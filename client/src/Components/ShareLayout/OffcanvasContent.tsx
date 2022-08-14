import {memo, useState} from 'react'
import LeftColumn from './LeftColumn'
import RightColumn from './RightColumn'
import {Button} from 'react-bootstrap'
function OffcanvasContent({user,setUser,socket}:{socket:any,user:any,setUser:any})
{
    const [left, setLeft] = useState(true)
    return (
        <>
            <div className='w-100 d-flex flex-column align-items-center'>
                <Button variant = "success" className="mb-3" onClick={()=>{setLeft(true)}}>
                    Find Friends
                </Button>
                <Button className="mb-3" onClick={()=>{setLeft(false)}}>
                    Your friends
                </Button>
            </div>
            <div  className='w-100' style={{padding:0}}>
            {left?
            <LeftColumn user={user} setUser={setUser} socket={socket}/>
            :
            <RightColumn user={user} setUser={setUser} socket={socket}/>
            }
            </div>
        </>
    )
}
export default memo(OffcanvasContent)