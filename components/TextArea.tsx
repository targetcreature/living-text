import { useEffect, useState } from "react"
import { useStore } from "../context"
import { Word } from "./Word2"

export const Form: React.FC = () => {

    const { words, setStore, source, pushWord, translation } = useStore()

    const [state, setState] = useState("")

    console.log(translation)

    const print = translation.concat(state).join(" ")

    console.log(print)



    return (
        <div id="form">
            {
                source.map((w, i) =>
                    <Word key={i} word={w} index={i} />
                )
            }
            <textarea id="text" onChange={({ target }) => {

                const isSpace = target.value.slice(-1) === " "
                const words = target.value.split(" ")

                if (isSpace) {
                    pushWord(words[words.length - 2])
                    setState("")
                }

                setState(words[words.length-1])



            }} value={print} />

            <div id="preview">
                {
                    translation.map((w, i) => <span key={i}>{w} </span>)
                }
            </div>
        </div>
    )

}