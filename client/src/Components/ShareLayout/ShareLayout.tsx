import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {Link, Outlet} from 'react-router-dom'
import LeftColumn from './LeftColumn'
import RightColumn from './RightColumn'
import Row from 'react-bootstrap/Row'
import Offcanvas from 'react-bootstrap/Offcanvas'
import Button from 'react-bootstrap/Button';
import OffcanvasContent from './OffcanvasContent'
import {memo, useEffect, useState} from 'react'
function ShareLayout({user,setUser, socket}:{socket:any,user:any,setUser:any})
{
    const [expand, setExpand] = useState(true)
    const [show, setShow] = useState(false);
    const toggleOffCanvas = () => {
      setShow((show) => !show);
    };
    useEffect(()=>{
      function handleResize(){
        if(window.innerWidth<800)
        setExpand(false)
        else
        setExpand(true)
      }
      window.addEventListener('resize',handleResize)
      return ()=>{
        window.removeEventListener('resize', handleResize)
      }
    },[])
    return (
    <div className="vh-100" style={{overflowY: 'scroll'}}>
    <Navbar bg="dark" variant="dark" expand={expand}>
    <Container>
      <Navbar.Brand as={Link} to="/">ChatApp</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/">
            Home
          </Nav.Link>
        </Nav>
        <Nav className="ms-auto">
          {expand && <div className="d-flex">
          {!user && 
          <Nav.Link  as={Link} to="/register">Register</Nav.Link>
          }
          {!user&&
          <Nav.Link  as={Link} to="/login">Log in</Nav.Link>
          }
          {user&&
          <Nav.Link  as={Link} to="/logout">Log out</Nav.Link>
          }
          {user&&
          <Nav.Link  as={Link} to={`/profile/${user?user._id:""}`}>Hi, {user.username}</Nav.Link>
          }
          </div>}
        </Nav>
        <Navbar.Toggle onClick={toggleOffCanvas} aria-controls={`offcanvasNavbar-expand-${expand}`} />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-${expand}`}
          aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
          placement="end"
          show={show}
          onHide={toggleOffCanvas}
          style={{borderRadius:10}}
        >
          <Offcanvas.Header closeButton className="mb-3"  style={{borderBottom:'1px solid #333'}}>
            <Offcanvas.Title className="w-75 d-flex justify-content-between" id={`offcanvasNavbarLabel-expand-${expand}`}>
              <Button variant="success" onClick={toggleOffCanvas}>
                {user&&
                <Nav.Link  as={Link} to={`/profile/${user?user._id:""}`}>Hi, {user.username}</Nav.Link>
                }
                {!user&&
                <Nav.Link  as={Link} to="/login">Log in</Nav.Link>
                }
              </Button>
              <Button onClick={toggleOffCanvas}>
                {user&&
                <Nav.Link  as={Link} to="/logout">Log out</Nav.Link>
                }
                {!user && 
                <Nav.Link  as={Link} to="/register">Register</Nav.Link>
                }
              </Button>
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body style={{padding:0}}>
            <OffcanvasContent user={user} setUser={setUser} socket={socket}/>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
    </Container>
    </Navbar>
    <Container className="h-100 w-100" fluid style={{margin:0, padding:0}}>
    <Row className="h-100 w-100" style={{margin:0, padding:0}} >
    {expand && 
    <div className="col-3" style={{padding:0}}>
      <LeftColumn user={user} setUser={setUser} socket={socket}/>
    </div>
    }
    <div className={expand?"col-6":"col-12"} style={{marginTop:10}}>
    <Outlet/>   
    </div>
    {expand && 
    <div className="col-3" style={{padding:0}}>
      <RightColumn user={user} setUser={setUser} socket={socket}/>
    </div>
    }
    </Row>
    </Container>
    </div>
    )
}
export default memo(ShareLayout)