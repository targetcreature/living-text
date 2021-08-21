import { useEffect, useState } from "react"
import fetch from "isomorphic-unfetch"
import { Word } from "../components/Word"
import { Provider, useStore } from "../context"
import { Form } from "../components/Form"

const App: React.FC = () => {

    useEffect(() => {




    }, [])

    return (
        <Provider>
            <div style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                alignContent: "center",
                justifyContent: "center",
                padding: "5vh 0"
            }}>

                <div style={{
                    fontSize: 40,
                    width: "50vw"
                }}>
                    <Form />
                    <Pause/>
                </div>
            </div>
        </Provider>
    )
}

const Pause: React.FC = () => {

    const [isHover, setHover] = useState(false)
    const {isPause, setStore} = useStore()

    return (
        <div
            onMouseEnter={()=>setHover(true)}
            onMouseLeave={()=>setHover(false)}
            onClick={()=>setStore((state)=>{
                return {...state, isPause: !state.isPause}
            })}
            style={{
                position: "absolute",
                top: "5vh",
                right: "5vh",
                border: `1px solid ${isHover || isPause ? "black" : "lightgray"}`,
                background: isHover || isPause ? "lightgray" : "none",
            }}>
            Pause
        </div>
    )

}

export default App