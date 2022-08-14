import {useContext, useState} from 'react'
import {flashContext} from '../../States/ForFlash'
import {Toast} from 'react-bootstrap'
export default function FlashBox({content, state}:{content:string, state:string})
{
    const {setFlashPop, setFlashContent, setFlashState} = useContext(flashContext)
    const [variant, setVariant] = useState(()=>{
        if(state==='success')
            return 'Success'
        else
            return 'Danger'
    })
    const [showA, setShowA] = useState(true);
    return (
        <Toast onClose = {()=>{setFlashPop(false); setFlashContent(""); setFlashState("")}}
          className="d-inline-block m-1"
          bg={variant.toLowerCase()}
        >
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">Hi there</strong>
            <small>11 mins ago</small>
          </Toast.Header>
          <Toast.Body className={variant === 'Dark' ? 'text-white':""}>
            {content}
          </Toast.Body>
        </Toast>
    )
}