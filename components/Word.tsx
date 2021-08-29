import { useEffect, useMemo, useRef, useState } from "react"
import { useStore } from "../context"
import ContentEditable from "react-contenteditable"
import { BiSkipNext as NextIcon } from "react-icons/bi"
import { BiSkipPrevious as PrevIcon } from "react-icons/bi"
import { IoMdPause as PauseIcon } from "react-icons/io"
import { fetchData, getPos, getPrint, stripPunc, removeIndex } from "../context/lib"
import { Data } from "../context/_types"

export const Word: React.FC<{ word: string, index: number }> = ({ word, index }) => {

    if (word === " ") return null

    const { isPause, isOriginal, setTranslate, setStore } = useStore()

    const ref = useRef<HTMLInputElement>()
    const [width, setWidth] = useState(0)

    const [allSynonyms, setAllSynonyms] = useState({})
    // const [allSynonyms, setAllSynonyms] = useState({ all: [] })

    const [synonyms, setSynonyms] = useState(() => {
        const [w] = stripPunc(word)
        return [w]
    })

    const [punc, setPunc] = useState("")

    const [source, setSource] = useState(() => {
        const [w] = stripPunc(word)
        return w
    })
    const [current, setCurrent] = useState(0)
    const [pauseCount, setPause] = useState(0)

    const [pos, setPos] = useState([0])

    const [isHover, setHover] = useState(false)
    const [isFocus, setFocus] = useState(false)
    const [isPinned, setPinned] = useState(false)

    useEffect(() => {

        setPos(() => {
            return Object.keys(allSynonyms).map((_, i) => i)
        })

    }, [allSynonyms])

    useEffect(() => {

        const interval = setInterval(() => setCurrent((c) => c + 1), 5000)

        const [send, punc] = stripPunc(word)

        setPunc(punc)
        setSource(send)

        fetchData(send, (data) => {
            data.map((d) =>
                d.meanings.map((m) =>
                    m.definitions.map((def) =>
                        setAllSynonyms((s) => {
                            const speech = m.partOfSpeech
                            const arr = s[speech] || []
                            const newArray = [...arr, ...def.synonyms]
                            // const newAll = [...s.all, ...def.synonyms]
                            if (def.synonyms.length) {
                                return {
                                    ...s,
                                    // all: newAll,
                                    [speech]: newArray
                                }
                            }
                            return s
                        }
                        ))))

            data.map((d) =>
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
    const idx = paused ? pauseCount : !idxCount ? 0 : current

    const pool = pos.reduce((prev, val)=>{
        const syns = Object.values(allSynonyms)
        return prev.concat(syns[val])
    },[source])

    const print = getPrint(source, pool[idx], punc)

    useEffect(() => {
        setTranslate(print, index)
    }, [print])

    console.log(pool)

    return (
        <div className={`wordWrap`}
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
                <>
                    <div className="icons">
                        <PrevIcon
                            className="left"
                            onClick={() => {
                                setPinned(true)
                                setPause((p) => p > 0 ? p - 1 : pool.length)
                            }} />
                        <PauseIcon
                            className={`center ${isPinned ? "active" : ""}`}
                            onClick={() => setPinned((p) => !p)}
                        />
                        <NextIcon
                            className="right"
                            onClick={() => {
                                setPinned(true)
                                setWidth(ref && ref.current ? ref.current.offsetWidth : 0)
                                setPause((p) => p > pool.length ? 0 : p + 1)
                            }} />
                    </div>
                </>
            }
            <ContentEditable
                html={`<span>${print}${punc}</span>`}
                disabled={false}
                onChange={() => console.log("changed")}
                onFocus={() => {
                    setFocus(true)
                    setPinned(true)
                    setStore((state) => {
                        return { ...state, isPause: true }
                    })
                }}
                onBlur={() => {
                    setFocus(false)
                    setStore((state) => {
                        return { ...state, isPause: false }
                    })
                }}
                className={`editable ${isHover ? "active" : ""} ${isPinned ? "pinned" : ""}`}
            />
            {
                isHover &&
                <div className="speech">
                    {
                        Object.keys(allSynonyms).map((k, i) => {
                            return (
                                <span
                                    key={i}
                                    className={pos.includes(i) ? "active" : ""}
                                    onClick={() => {
                                        if (pos.includes(i)) {
                                            console.log("true")
                                            const idx = pos.indexOf(i)
                                            setPos((p) => {
                                                return removeIndex(p, idx)
                                            })
                                        }
                                        else {
                                            setPos((p) => [...p, i])
                                        }
                                    }}
                                >{getPos(k)}</span>
                            )
                        })
                    }
                </div>
            }
        </div >
    )

}