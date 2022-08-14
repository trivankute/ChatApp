import './GlobalState.css'
export default function GlobalState({children}:{children:React.ReactNode})
{
    return(
        <div className="big_container">
            {children}
        </div>
    )
}