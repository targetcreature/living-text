import { useEffect, useMemo, useState } from "react"
import { useStore } from "../context"
import fetch from "isomorphic-unfetch"
import ContentEditable from "react-contenteditable"
import { BiSkipNext as NextIcon } from "react-icons/bi"
import { BiSkipPrevious as PrevIcon } from "react-icons/bi"

export const Word: React.FC<{ word: string, index: number }> = ({ word, index }) => {

    if (word === " ") return null

    const { isPause, isOriginal, setTranslate } = useStore()
    const [synonyms, setSynonyms] = useState(()=>{
        const isPunc = !word.match("^[a-zA-Z0-9]+$")
        return [isPunc ? word.slice(0, word.match(/[^a-zA-Z0-9]/).index) : word]
    })
    const [current, setCurrent] = useState(0)
    const [pauseCount, setPause] = useState(0)
    const [isFocus, setFocus] = useState(false)

    const [punc, setPunc] = useState("")

    const [localPause, setLocalPause] = useState(false)

    const [isHover, setHover] = useState(false)

    useEffect(() => {

        const interval = setInterval(() => setCurrent((c) => c + 1), 5000)

        const isPunc = !word.match("^[a-zA-Z0-9]+$")
        const send = isPunc ? word.slice(0, word.match(/[^a-zA-Z0-9]/).index) : word

        if (isPunc){
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

    console.log({punc})


    const triggerPause = () => setPause(current)

    useEffect(() => {
        setLocalPause(isPause)
    }, [isPause])

    useEffect(() => {
        if (localPause) {
            triggerPause()
        }
    }, [localPause])

    useEffect(() => {
        if (current > synonyms.length - 1) setCurrent(0)
    }, [synonyms, current])

    useEffect(() => {
        setLocalPause(isHover)
    }, [isHover])

    const idxCount = current
    const idx = !idxCount ? 0 : localPause ? pauseCount : current

    const source = synonyms[0]

    
    // const isLower = word[0] == word[0].toLowerCase() && word[0] != word[0].toUpperCase()
    const isLower = source[0] == source[0].toLowerCase() && source[0] != source[0].toUpperCase()
    
    const syn = synonyms[idx] || synonyms[0]

    console.log({source, syn, idx})

    const first = isLower ? syn[0] : syn[0].toUpperCase()
    const end = syn.slice(1)

    const print = isOriginal ? word : `${first}${end}`

    useEffect(() => {
        setTranslate(print, index)
    }, [print])

    return (
        <div className="wordWrap"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {
                isHover &&
                <div className="icon">
                    <PrevIcon />
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
            {
                isHover &&
                <div className="icon">
                    <NextIcon />
                </div>
            }
        </div>
    )

}