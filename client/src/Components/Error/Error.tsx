import {useEffect, memo} from 'react'
import {useNavigate} from 'react-router-dom'
const Error = () =>{
    const navigate = useNavigate()
    useEffect(()=>{
        let thisThing = setTimeout(()=>{
            navigate('/')
        },3000)
        return () => {
            clearTimeout(thisThing)
        }
    },[])
    return (
        <>
            <h1>Error page not found</h1>
            <h3>Error: 404</h3>
            <h3>You will comeback soon</h3>
        </>
    )
} 
export default memo(Error)