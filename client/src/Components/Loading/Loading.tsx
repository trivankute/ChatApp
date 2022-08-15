import {memo, useEffect} from 'react'
import {Spinner} from 'react-bootstrap'
import {useNavigate, useLocation} from 'react-router-dom'
function Loading({user}:{user:any})
{
    let navigate = useNavigate()
    let location = useLocation()
    useEffect(()=>{
        if(user)
        {
            navigate(`${location.pathname}`)
        }
    },[user])
    return (
        <div className='w-100 h-100 d-flex justify-content-center align-items-center position-absolute'
        style={{backgroundColor:'white', zIndex:10}}>
        <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
        </Spinner>
        </div>
    )
}
export default memo(Loading)