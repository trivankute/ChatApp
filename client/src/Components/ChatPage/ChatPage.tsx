import {memo, useState, useRef, useLayoutEffect, useEffect} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import styles from './ChatPage.module.css'
import axios from 'axios'
import {Button, Form} from 'react-bootstrap'
import url from '../../serverUrl'
const ChatPage = ({user,socket, setUser}:{setUser:any, user:any,socket:any}) => {
    const chatShowing = useRef<any>(null)
    const {friendName, chatPageID} = useParams()
    const [input, setInput] = useState("")
    const [chatContent, setChatContent] = useState<Array<{input:string, username:string, time:string}>>()
    const navigate = useNavigate()
    async function handleInput()
    {
        if(input!=='')
        {
            let now = new Date()
            let month = now.getMonth() + 1

            let minute = now.getMinutes()
            let newMinute
            if(minute<10)
            newMinute = '0' + minute.toString()
            else
            newMinute = minute

            let hour = now.getHours()
            let newHour
            if(hour<10)
            newHour = '0' + minute.toString()
            else
            newHour = hour
            let time = newHour + ':' + newMinute + " " + now.getDate()+'/'+month+'/'+now.getFullYear()
            setChatContent([...chatContent!,{input,username:user.username,time:time}])
            setInput('')
            axios.post(`${url}chatrooms/${chatPageID}`,
            {content:{input,username:user.username,time:time},username:user.username, friendName:friendName},
            {withCredentials: true})
                .then((res)=>{
                    if(res.data.state==='success')
                    {
                        socket.emit("sendText",chatPageID)
                        socket.emit('forSetUser',friendName, `${friendName} has just sent you a message`)
                    }
                })
        }
    }
    
    async function takeContentRoom()
    {
        axios.get(`${url}chatrooms/${chatPageID}`,
        {withCredentials: true})
            .then(res=>{
                if(res.data.state==='success')
                {
                    setChatContent(()=>{
                        return res.data.room.content
                    })
                }
            })
    }
    async function resetNewMess()
    {
        axios.post(`${url}chatrooms/${chatPageID}/resetnewmess`,{username:user.username, friendName:friendName}, {withCredentials: true})
            .then((res)=>{
                if(res.data.state==='success')
                {
                    setUser(res.data.user)
                }
            })
    }
    useLayoutEffect(()=>{
        resetNewMess()
        takeContentRoom()
        socket.emit('joinRoom',chatPageID)
    },[chatPageID])

    useLayoutEffect(()=>{
        socket.on('afterFirstPersonSendText',()=>{
            takeContentRoom()
        })
    },[chatPageID])

    useLayoutEffect(()=>{
        chatShowing.current.scrollTop = chatShowing.current.scrollHeight - chatShowing.current.clientHeight
    },[chatContent])

    return (
        <div>
            <h1 className="text-center">Chat page with friend: {friendName}</h1>
            <div className='w-100' style={{display:'flex', justifyContent:'center'}}>
            <div className={styles.chatBox} >
                <div className={styles.chatShowing} ref={chatShowing}>
                    {user&&chatContent && chatContent.map((item,index)=>{
                        return (
                            <>
                            <div style={{width:"100%",marginTop:'19px'}}></div>
                            <div className={item.username===user.username?styles.chatTextRow_right:styles.chatTextRow_left}>
                            <div className={styles.chatTextBox} key={index}>
                                {item.input}
                                <br>
                                </br>
                                <>
                                {item.time}
                                </>
                            </div>
                            </div>
                            </>
                        )
                    })}
                </div>
                <Form className='d-flex justify-content-center' onSubmit={(e)=>{e.preventDefault(); handleInput(); resetNewMess()}}>
                <Form.Control className={styles.chatInput} placeholder="Chat now" value={input} onFocus={resetNewMess} onChange={(e)=>{setInput(e.target.value)}}/>
                <div style={{display:"block", width:65, height: 38}}>

                </div>
                <Button className={styles.chatBtn} onClick={()=>{handleInput(); resetNewMess()}}>Send</Button>
                </Form>
            </div>
            </div>
            <Button className='mt-3 me-3' onClick={()=>{navigate('/chatrooms')}}>Go back</Button>

        </div>
    )
}
export default memo(ChatPage)