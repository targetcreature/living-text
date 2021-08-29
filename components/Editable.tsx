import { Fragment, useEffect, useState } from "react"
import ContentEditable from "react-contenteditable"
import { useStore } from "../context"
import { Word } from "./Word"

export const Editable: React.FC = () => {

    const { source, pushWord } = useStore()

    const [state, setState] = useState("")

    const handleChange = (html: string) => {

        const word = html.split("&nbsp;")
        const isSpace = !word[word.length - 1]
        const send = word.filter((w) => !!w)[0]

        setState(send)

        if (isSpace) {
            pushWord(send)
            setState("")
        }
    }

    return (
        <div>
            {
                source.map((w, i) =>
                    <Fragment key={i}>
                        <Word word={w} index={i} />
                        <span>&nbsp;</span>
                    </Fragment>
                )
            }
            <div className="newContainer">
                <ContentEditable
                    html={state} // innerHTML of the editable div
                    disabled={false}       // use true to disable editing
                    onChange={({ target }) => handleChange(target.value)} // handle innerHTML change
                    className="editable new"
                />
            </div>
        </div>
    )

}