import { useEffect, useState } from "react"
import { useStore } from "../context"
import { Word } from "./Word"

export const Form: React.FC = () => {

    const { words, setStore } = useStore()

    const [state, setState] = useState("")

    return (
        <div>
            {
                words.map((_, i) =>
                    <Word key={i} index={i} />
                )
            }
            <input

                autoFocus

                onChange={({ target }) => {

                    const { value } = target
                    setState((s) => target.value)
                    if (/\s+$/.test(value)) {

                        setStore((s) => {
                            s.words.push(state || " ")
                            return s
                        })
                        setState("")
                    }
                }} value={state}

                style={{
                    border: 0,
                    borderBottom: "3px solid lightgray",
                    fontSize: 40,
                    outline: 0
                }}
            />
        </div>
    )

}