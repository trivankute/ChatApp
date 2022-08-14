import axios from 'axios'
import {useState, memo} from 'react'
import {useNavigate} from 'react-router-dom'
import {Card, Form, Button} from 'react-bootstrap'
import url from '../../serverUrl'
function Register({handleFlash, setUser, socket}:{socket:any,handleFlash:(content: string, state: string) => void,setUser:any})
{
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    let navigate = useNavigate()
    
    const handleRegister = async ()=>
    {
        await axios.post(`${url}register`,{username:username,password:password}, { withCredentials: true})
            .then(res=>{
                if(res.data.state==="success")
                {
                handleFlash("Congratulations! registered successfully","success")
                setUser(res.data.user)
                setUsername("")
                setPassword("")
                navigate('/')    
                socket.emit("aUserOnline",res.data.user.username)
                }
                else
                {
                handleFlash(res.data.message,"fail")
                setPassword("")
                }
            })
    }
    
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event:any) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };
    return(
        <div className="d-flex flex-column align-items-center">
            {/* <form  onSubmit={(e)=>{e.preventDefault()}} className="d-flex flex-column align-items-center"> */}
            <Card style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title className="text-center">
                    Register form
                </Card.Title>
                <Form noValidate validated={validated} onSubmit={handleSubmit} className="w-100 d-flex flex-column align-items-center">
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Username:</Form.Label>
                    <Form.Control required type="username" placeholder="Enter username" value={username} onChange={(e)=>{setUsername(e.target.value)}} />
                    <Form.Control.Feedback>OK!</Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">
                    Please choose a username.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password:</Form.Label>
                    <Form.Control required type="password" placeholder="Password" value={password} onChange={(e)=>{setPassword(e.target.value)}} />
                    <Form.Control.Feedback>OK!</Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">
                    Please choose a password.
                    </Form.Control.Feedback>
                </Form.Group>
                <Button variant="primary" type="submit" onClick={handleRegister}>
                    Submit
                </Button>
                </Form>
            </Card.Body>
            </Card>
                {/* <br></br>
                <input type="text" placeholder="Username" id="username" value={username} onChange={(e)=>{setUsername(e.target.value)}} />
                <input type="password" placeholder="password" id="password" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
                <button onClick={handleRegister}>Register</button> */}
            {/* </form> */}
        </div>
    )
}
export default memo(Register)