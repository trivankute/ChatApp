import {useState, createContext} from 'react'
import FlashBox from '../Components/FlashBox/FlashBox'
export const flashContext = createContext<any>(null)
function ForFlash({children}:{children:React.ReactNode}):JSX.Element
{
    const [flashPop, setFlashPop] = useState<boolean>(false)
    const [flashContent, setFlashContent] = useState<string>("")
    const [flashState, setFlashState] = useState<string>("")
    return (
        <flashContext.Provider value={{setFlashPop, setFlashContent, setFlashState}}>
            {flashPop && 
            <div style={{display:'flex', justifyContent: 'center', position:'absolute',
             zIndex:"2", top:'10px', left:'50%', transform:'translateX(-50%)'}}>
                <FlashBox content={flashContent} state={flashState}/>
            </div>
            }
            {children}
        </flashContext.Provider>
    )
}
export default ForFlash