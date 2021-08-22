import { useEffect, useState } from "react"
import { useStore } from "../context"
import { Word } from "./Word"

export const Form: React.FC = () => {

    const { words, setStore } = useStore()

    const [state, setState] = useState("")

    return (
        <div id="form">
            {
                words.map(({ isPunc, isLine, content }, i) =>
                    isPunc ?
                        <span key={i}>{content}</span>
                        :
                        isLine ?
                            <div />
                            :
                            <Word key={i} word={content} />
                )
            }
            <input

            ref={(input)=> input && input.focus()}

                onKeyDown={e => {
                    if (e.key === 'Enter') {

                        setStore((s) => {
                            if (state) {
                                s.words.push({ content: state })
                            }
                            s.words.push({ content: "", isLine: true })
                            return s
                        })
                        setState("")

                    }
                }
                }

                onChange={({ target }) => {

                    const { value } = target

                    const isEmpty = !value || !!value[0].match(" ") || !value[0].match("^[a-zA-Z0-9]+$")

                    if (!isEmpty) {

                        const first = value.slice(0, -1)
                        const last = value.slice(-1)

                        const isPunc = !last.match("^[a-zA-Z0-9]+$") && !last.match(`'`)
                        const isSpace = !!last.match(" ")

                        if (last.match("\n")) console.log("new line")


                        if (isPunc) {
                            setStore((s) => {
                                s.words.push({ content: first })
                                s.words.push({ content: `${last}${!isSpace ? " " : ""}`, isPunc: true })
                                return s
                            })
                            setState("")
                        }
                        else {
                            setState((s) => isEmpty ? "" : target.value)
                        }

                    }

                    else setState("")



                }}

                value={state}

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