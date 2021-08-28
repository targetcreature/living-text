import { useEffect, useRef, useState } from "react"
import { Provider, useStore } from "../context"
import { TextArea } from "../components/TextArea"
import { IoMdPause as PauseIcon } from "react-icons/io"
import { IoMdPlay as PlayIcon } from "react-icons/io"
import { VscEye as EyeIcon } from "react-icons/vsc"
import { Editable } from "../components/Editable"

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
                    <Editable />
                    <UI />
                </div>
            </div>
        </Provider>
    )
}

const UI: React.FC = () => {
    return (
        <div id="buttons">
            <Pause />
            <Original />
        </div>
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
            onClick={() => setStore((s) => ({ ...s, isOriginal: !s.isOriginal }))}
            color={isOriginal ? "black" : "lightgray"}
        />
    )

}

export default App