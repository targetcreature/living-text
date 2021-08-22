import { useEffect, useRef, useState } from "react"
import { Provider, useStore } from "../context"
import { Form } from "../components/Form"
import { IoMdPause as PauseIcon } from "react-icons/io"
import { IoMdPlay as PlayIcon } from "react-icons/io"
import { VscEye as EyeIcon } from "react-icons/vsc"

const App: React.FC = () => {

    const ref = useRef()

    return (
        <Provider>
            <div style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                alignContent: "center",
                justifyContent: "center",
                padding: "5vh 0",
            }}
            >

                <div id="container">
                    <Form />
                    <div
                        id="buttons"
                    // style={{
                    //     position: "absolute",
                    //     top: "5vh",
                    //     right: "5vh",
                    // }}
                    >
                        <Pause />
                        <Original />
                    </div>
                </div>
            </div>
        </Provider>
    )
}

const Pause: React.FC = () => {

    const [isHover, setHover] = useState(false)
    const { isPause, setStore } = useStore()

    return (
        <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={() => setStore((state) => {
                return { ...state, isPause: !state.isPause }
            })}
        >
            {
                isPause ?
                    <PlayIcon color="lightgray" />
                    :
                    <PauseIcon color="lightgray" />
            }
        </div>
    )

}

const Original: React.FC = () => {

    const { isOriginal, setStore } = useStore()

    return (
        <EyeIcon
            onMouseEnter={() => setStore((s) => ({ ...s, isOriginal: true }))}
            onMouseLeave={() => setStore((s) => ({ ...s, isOriginal: false }))}
            onClick={()=> setStore((s)=>({...s, isOriginal: !s.isOriginal}))}
            color={isOriginal ? "black" : "lightgray"}
        />
    )

}

export default App