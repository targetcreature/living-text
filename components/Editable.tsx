import { useEffect, useState } from "react"
import ContentEditable from "react-contenteditable"
import { useStore } from "../context"
import { Word } from "./Word2"

export const Editable: React.FC = () => {

    const { words, setStore, source, pushWord, translation } = useStore()

    const [state, setState] = useState("")

    const [prev, setPrev] = useState("")

    const print = translation.concat(state).join(" ")

    const handleChange = (html: string) => {

        // console.log(html)
        const word = html.split("&nbsp;")
        // const hasSpace = word.length > 0
        const isSpace = !word[word.length-1]
        const send = word.filter((w)=>!!w)[0]

        // // const isSpace = html.match(/$"&nbsp;"/)

        if (isSpace) {
            pushWord(send)
            setState("")
        }

        else setState(send)

    }

    return (
        <div>
            {
                source.map((w, i) =>
                    <>
                        <Word key={i} word={w} index={i} />
                        <span>&nbsp;</span>
                    </>
                )
            }

            <ContentEditable
                // innerRef={this.contentEditable}
                html={state} // innerHTML of the editable div
                disabled={false}       // use true to disable editing
                onChange={({ target }) => handleChange(target.value)} // handle innerHTML change
                className="editable new"
            // onKeyUp={(e)=>console.log(e)}
            />
        </div>
    )



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

                setState(words[words.length - 1])



            }} value={print} />

            <div id="preview">
                {
                    translation.map((w, i) => <span key={i}>{w} </span>)
                }
            </div>
        </div>
    )

}