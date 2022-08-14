import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import {useState, memo} from 'react'
import {Card, Form, Button} from 'react-bootstrap'
import url from '../../serverUrl'
function Login({handleFlash, socket, setUser}:{socket:any, handleFlash:(content: string, state: string) => void,setUser:any}):JSX.Element
{
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    let navigate = useNavigate()
    const handleLogin = async () =>
        {
            try{
                await axios.post(`${url}login`,{username:username,password:password},{withCredentials: true})
                .then((res)=>{
                    if(res.data.state==="success")
                    {
                    handleFlash("Congratulations! Logged in successfully","success")
                    setUser(res.data.user)
                    localStorage.setItem('chatappusername',res.data.user._id)
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
            catch(e)
            {
                handleFlash("Username or password was not correct.","fail")
                setPassword("")
            }
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
    return (
        // <>
        // <form onSubmit={(e)=>{e.preventDefault()}}>
        //     <label htmlFor="" id="username">Username:</label>
        //     <input type="text" placeholder="Username" id="username" value={username} onChange={(e)=>{setUsername(e.target.value)}}/>
        //     <br></br>
        //     <label htmlFor="" id="password">Password:</label>
        //     <input type="password" placeholder="password" id="password" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
        //     <button onClick={handleLogin}>Login</button>
        // </form>
        // </>
        <div className="d-flex flex-column align-items-center">
        {/* <form  onSubmit={(e)=>{e.preventDefault()}} className="d-flex flex-column align-items-center"> */}
        <Card style={{ width: '18rem' }}>
        <Card.Body >
            <Card.Title className="text-center">
                Login form
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
            <Button variant="primary" type="submit" onClick={handleLogin}>
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
export default memo(Login)