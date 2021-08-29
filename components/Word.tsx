import { useEffect, useMemo, useRef, useState } from "react"
import { useStore } from "../context"
import fetch from "isomorphic-unfetch"
import ContentEditable from "react-contenteditable"
import { BiSkipNext as NextIcon } from "react-icons/bi"
import { BiSkipPrevious as PrevIcon } from "react-icons/bi"
import { IoMdPause as PauseIcon } from "react-icons/io"

export const Word: React.FC<{ word: string, index: number }> = ({ word, index }) => {

    if (word === " ") return null

    const ref = useRef()

    const [width, setWidth] = useState(0)

    const { isPause, isOriginal, setTranslate } = useStore()
    const [synonyms, setSynonyms] = useState(() => {
        const isPunc = !word.match("^[a-zA-Z0-9]+$")
        return [isPunc ? word.slice(0, word.match(/[^a-zA-Z0-9]/).index) : word]
    })
    const [current, setCurrent] = useState(0)
    const [pauseCount, setPause] = useState(0)
    const [isFocus, setFocus] = useState(false)
    const [isPinned, setPinned] = useState(false)

    const [punc, setPunc] = useState("")

    const [isHover, setHover] = useState(false)

    useEffect(() => {

        const interval = setInterval(() => setCurrent((c) => c + 1), 5000)

        const isPunc = !word.match("^[a-zA-Z0-9]+$")
        const send = isPunc ? word.slice(0, word.match(/[^a-zA-Z0-9]/).index) : word

        if (isPunc) {
            setPunc(word.slice(word.match(/[^a-zA-Z0-9]/).index))
        }

        fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + send)
            .then(r => r.json())
            .then(data => {
                data.length > 0 && data.map((d) =>
                    d.meanings.map((m) =>
                        m.definitions.map((def) =>
                            setSynonyms((s) => {
                                return [...s, ...def.synonyms]
                            }))))
            })

        return () => clearInterval(interval)
    }, [word])

    const triggerPause = () => setPause(current)

    useEffect(() => {
        if (current > synonyms.length - 1) setCurrent(0)
    }, [synonyms, current])

    const paused = isPause || isHover || isFocus || isPinned

    useEffect(() => {
        if (paused) triggerPause()
    }, [paused])

    const idxCount = current
    const idx = !idxCount ? 0 : paused ? pauseCount : current

    const source = synonyms[0]

    const isLower = source[0] == source[0].toLowerCase() && source[0] != source[0].toUpperCase()

    const syn = synonyms[idx] || synonyms[0]

    const first = isLower ? syn[0] : syn[0].toUpperCase()
    const end = syn.slice(1)

    const print = isOriginal ? source : `${first}${end}`

    useEffect(() => {
        setTranslate(print, index)
    }, [print])

    return (
        <div className="wordWrap"
            ref={ref}
            onMouseEnter={(e) => {
                setHover(true)
            }}
            onMouseLeave={() => {
                setHover(false)
                setWidth(0)
            }}
            style={{
                minWidth: width
            }}
        >
            {
                isHover &&
                <div className="icons">
                    <PrevIcon
                        className="left"
                        onClick={() => {
                            setPause((p) => p > 0 ? p - 1 : synonyms.length)
                        }} />
                    <PauseIcon
                        className="center"
                        onClick={() => setPinned((p) => !p)}
                        color={isPinned ? "pink" : "black"}
                    />
                    <NextIcon
                        className="right"
                        onClick={() => {
                            setWidth(ref && ref.current ? ref.current.offsetWidth - 22 : 0)
                            setPause((p) => p > synonyms.length ? 0 : p + 1)
                        }} />
                </div>
            }
            <ContentEditable
                html={`<span>${print}${punc}</span>`}
                disabled={false}
                onChange={() => console.log("changed")}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                className={`editable ${isHover ? "active" : ""}`}
            />
        </div >
    )

}