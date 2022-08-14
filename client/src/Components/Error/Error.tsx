import {useEffect, useState, memo} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
const Error = ({user}:{user:any}) =>{
    const [error, setError] = useState("")
    const [errNum, setErrNum] = useState(400)
    const location = useLocation()
    const navigate = useNavigate()
    useEffect(()=>{
        if(user)
        {
            navigate(`/${location.pathname}`)
        }
    },[user])
    return (
        <>
            <h1>Error page</h1>
            <h3>Error: {error} {errNum}</h3>
            <h3>You will comeback soon</h3>
        </>
    )
} 
export default memo(Error)